package com.drillmap.backend.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.drillmap.backend.dtos.EstadoDTO;
import com.drillmap.backend.dtos.PocoDTO;
import com.drillmap.backend.entities.Poco;
import com.drillmap.backend.repositories.BaciaRepository;
import com.drillmap.backend.repositories.BlocoRepository;
import com.drillmap.backend.repositories.CampoRepository;
import com.drillmap.backend.repositories.PocoRepository;
import com.drillmap.backend.specifications.PocoSpecification;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SearchService {

    private final BaciaRepository baciaRepository;
    private final BlocoRepository blocoRepository;
    private final CampoRepository campoRepository;
    private final PocoRepository pocoRepository;
    private final JdbcTemplate jdbcTemplate;

    public List<PocoDTO> searchFinal(String categoria, Map<String, Object> filtros){
        Specification<Poco> spec = PocoSpecification.criarSpecification(categoria, filtros);
        List<Poco> pocos = pocoRepository.findAll(spec);

        return pocos.stream()
        .map(poco -> new PocoDTO(poco.getNome(), poco.getLatitude(), poco.getLongitude()))
        .collect(Collectors.<PocoDTO>toList());
    }

    public List<EstadoDTO> buscarEstadosPorCategoria(String categoria, Map<String, Object> filtros) {
        String nome = filtros.getOrDefault("nome", "").toString();
    
        List<String> estados;
    
        switch (categoria.toLowerCase()) {
            case "bacias":
                estados = baciaRepository.findEstadoByNome(nome);
                break;
            case "blocos":
                estados = blocoRepository.findEstadoByNome(nome);
                break;
            case "campos":
                estados = campoRepository.findEstadoByNome(nome);
                break;
            default:
                throw new IllegalArgumentException("Categoria inválida para buscar estados");
        }
    
        System.out.println("Estados encontrados: " + estados);
        return estados.stream().map(EstadoDTO::new).collect(Collectors.toList());
    }
    

    public  List<Map<String, Object>> subFiltros(String tabela, String campo, int page, int size){
        if(campo.equalsIgnoreCase("Estado")){
            return buscarEstadosPorTabela(tabela);
        }
        
        String query = String.format("SELECT %s FROM %s LIMIT ? OFFSET ?", campo, tabela);
        return jdbcTemplate.queryForList(query, size, page * size);
    }

    private List<Map<String, Object>> buscarEstadosPorTabela(String tabela) {
        List<String> estados;
        switch (tabela.toLowerCase()) {
            case "bacia": estados = baciaRepository.findDistinctEstados(); break;
            case "bloco": estados = blocoRepository.findDistinctEstados(); break;
            case "campo": estados = campoRepository.findDistinctEstados(); break;
            case "poço": estados = pocoRepository.findDistinctEstados(); break;
            default: throw new IllegalArgumentException("Tabela invalida para filtro de estado");
        }
        return estados.stream()
            .map(estado -> {
                Map<String, Object> map = new HashMap<>();
                map.put("estado", estado);
                return map;
            })
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> filtrarDados(String nome, String categoria){
        switch (categoria.toLowerCase()){
            case "bacias": return searchBacias(nome);
            case "blocos": return searchBlocos(nome);
            case "campos": return searchCampos(nome);
            case "pocos": return searchPocos(nome);
            default: throw  new IllegalArgumentException("Categoria inválida");
        }
    }

    private List<Map<String, Object>> searchBacias(String nome){
        return baciaRepository.findDistinctByNome(nome).stream()
            .map(obj -> {
                String nomeBacia = (String) obj[0];
                String estado = obj.length > 1 ? (String) obj[1]: "Desconhecido";
                return Map.of("nome", (Object) nomeBacia, "estado", estado);
            })
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> searchBlocos(String nome){
        return blocoRepository.findByNome(nome).stream()
            .map(bloco -> {
                Map<String, Object> response = new HashMap<>();
                response.put("bloco", bloco);
                if(bloco.getBacia() != null){
                    response.put("estado", bloco.getBacia().getEstado());
                }
                return response;
            })
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> searchCampos(String nome){
        return campoRepository.findByNome(nome).stream()
            .map(campo -> {
                Map<String, Object> response = new HashMap<>();
                response.put("campo", campo);
                if(campo.getBloco().getBacia() != null){
                    response.put("estado", campo.getBloco().getBacia().getEstado());
                }
                return response;
            })
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> searchPocos(String nome){
        return pocoRepository.findByNome(nome).stream()
        .map(poco -> {
            Map<String, Object> response = new HashMap<>();
            response.put("poco", poco);
            if(poco.getCampo().getBloco().getBacia() != null){
                response.put("estado", poco.getCampo().getBloco().getBacia().getEstado());
            }
            return response;
        })
        .collect(Collectors.toList());
    }
}
