package com.drillmap.backend.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.drillmap.backend.dtos.PocoDTO;
import com.drillmap.backend.entities.Poco;
import com.drillmap.backend.repositories.BaciaRepository;
import com.drillmap.backend.repositories.BlocoRepository;
import com.drillmap.backend.repositories.CampoRepository;
import com.drillmap.backend.repositories.PocoRepository;
import com.drillmap.backend.specifications.PocoSpecification;

import lombok.AllArgsConstructor;

/**
 * Serviço responsável por buscas e filtragens relacionadas a poços e entidades associadas.
 */
@Service
@AllArgsConstructor
public class SearchService {

    // Repositórios das entidades para acesso ao banco de dados
    private final BaciaRepository baciaRepository;
    private final BlocoRepository blocoRepository;
    private final CampoRepository campoRepository;
    private final PocoRepository pocoRepository;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Busca poços aplicando filtros dinâmicos e paginação.
     * 
     * @param filtros Mapa de filtros por categoria (ex: Bacias, Blocos, etc)
     * @param page Página solicitada
     * @param size Tamanho da página
     * @return Página de PocoDTOs filtrados
     */
    public Page<PocoDTO> buscarPoços(Map<String, Map<String, Object>> filtros, int page, int size) {

        // Cria objeto de paginação
        Pageable pageable = PageRequest.of(page, size);

        // Cria a Specification baseada nos filtros recebidos
        Specification<Poco> especificacao = PocoSpecification.aplicarFiltros(filtros);

        // Executa a consulta paginada usando o repositório
        Page<Poco> pageDePoços = pocoRepository.findAll(especificacao, pageable);

        // Converte os resultados para DTOs
        List<PocoDTO> pocoDTOs = pageDePoços.getContent().stream()
                                        .map(this::convertToDto)
                                        .collect(Collectors.toList());

        // Retorna um Page<> com os DTOs
        return new PageImpl<>(pocoDTOs, pageable, pageDePoços.getTotalElements());
    }

    /**
     * Converte um objeto Poco em PocoDTO.
     * 
     * @param poco Entidade Poco
     * @return DTO correspondente
     */
    private PocoDTO convertToDto(Poco poco) {
        return new PocoDTO(
            poco.getId(),
            poco.getNome(),
            poco.getCampo().getBloco().getNome(),
            poco.getCampo().getNome(),
            poco.getCampo().getBloco().getBacia().getNome(),
            poco.getLatitude(),
            poco.getLongitude(),
            poco.getCampo().getBloco().getBacia().getEstado(),
            poco.getSituacao(),
            poco.getInicio(),
            poco.getTermino(),
            poco.getConclusao(),
            poco.getReclassificacao(),
            poco.getTipodePoco(),
            poco.getCategoria(),
            poco.getPocoOperador(),
            poco.getCadastro()
        );
    }

    /**
     * Busca valores distintos de um campo em uma tabela, com suporte a paginação.
     * Se o campo for "Estado", busca os estados distintos da tabela.
     * 
     * @param tabela Nome da tabela
     * @param campo Nome do campo
     * @param page Página solicitada
     * @param size Tamanho da página
     * @return Lista de mapas com os valores encontrados
     */
    public List<Map<String, Object>> subFiltros(String tabela, String campo, int page, int size){
        // Se o campo for "Estado", busca estados distintos
        if(campo.equalsIgnoreCase("estado")){
            return buscarEstadosPorTabela(tabela);
        }
        
        // Monta e executa a query para buscar valores distintos do campo
        String query = String.format("SELECT %s FROM %s LIMIT ? OFFSET ?", campo, tabela);
        return jdbcTemplate.queryForList(query, size, page * size);
    }

    /**
     * Busca os estados distintos de uma tabela específica.
     * 
     * @param tabela Nome da tabela
     * @return Lista de mapas com os estados encontrados
     */
    private List<Map<String, Object>> buscarEstadosPorTabela(String tabela) {
        List<String> estados;
        // Seleciona o repositório correto conforme a tabela
        switch (tabela.toLowerCase()) {
            case "bacia": estados = baciaRepository.findDistinctEstados(); break;
            case "bloco": estados = blocoRepository.findDistinctEstados(); break;
            case "campo": estados = campoRepository.findDistinctEstados(); break;
            case "poco": estados = pocoRepository.findDistinctEstados(); break;
            default: throw new IllegalArgumentException("Tabela invalida para filtro de estado");
        }
        // Mapeia os estados para o formato de resposta
        return estados.stream()
            .map(estado -> {
                Map<String, Object> map = new HashMap<>();
                map.put("estado", estado);
                return map;
            })
            .collect(Collectors.toList());
    }

    /**
     * Filtra dados de acordo com o nome e categoria informados.
     * 
     * @param nome Nome a ser buscado
     * @param categoria Categoria (bacias, blocos, campos, pocos)
     * @return Lista de mapas com os resultados encontrados
     */
    public List<Map<String, Object>> filtrarDados(String nome, String categoria){
        switch (categoria.toLowerCase()){
            case "bacias": return searchBacias(nome);
            case "blocos": return searchBlocos(nome);
            case "campos": return searchCampos(nome);
            case "pocos": return searchPocos(nome);
            default: throw  new IllegalArgumentException("Categoria inválida");
        }
    }

    /**
     * Busca bacias pelo nome, retornando nome e estado.
     * 
     * @param nome Nome da bacia
     * @return Lista de mapas com nome e estado
     */
    private List<Map<String, Object>> searchBacias(String nome){
        return baciaRepository.findDistinctByNome(nome).stream()
            .map(obj -> {
                String nomeBacia = (String) obj[0];
                String estado = obj.length > 1 ? (String) obj[1]: "Desconhecido";
                return Map.of("nome", (Object) nomeBacia, "estado", estado);
            })
            .collect(Collectors.toList());
    }

    /**
     * Busca blocos pelo nome, retornando bloco e estado.
     * 
     * @param nome Nome do bloco
     * @return Lista de mapas com bloco e estado
     */
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

    /**
     * Busca campos pelo nome, retornando campo e estado.
     * 
     * @param nome Nome do campo
     * @return Lista de mapas com campo e estado
     */
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

    /**
     * Busca poços pelo nome, retornando poço e estado.
     * 
     * @param nome Nome do poço
     * @return Lista de mapas com poço e estado
     */
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
