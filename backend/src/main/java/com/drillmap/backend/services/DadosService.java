package com.drillmap.backend.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.drillmap.backend.entities.Bacia;
import com.drillmap.backend.entities.Bloco;
import com.drillmap.backend.entities.Campo;
import com.drillmap.backend.entities.Dados;
import com.drillmap.backend.entities.Poco;
import com.drillmap.backend.repositories.DadosRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DadosService {

    private final DadosRepository dadosRepository;
    private final PocoService pocoService;

    public Integer uploadDados(MultipartFile file) throws IOException {
        List<Dados> dados = parseCsv(file);
        dadosRepository.saveAll(dados);

        return dados.size();
    }

    public Integer updateDados(MultipartFile file) throws IOException {
        List<Dados> novosDados = parseCsv(file);
        int registrosAtualizados = 0;
    
        List<String> nomesPoco = novosDados.stream()
            .map(Dados::getNomePoco)
            .collect(Collectors.toList());

        List<Dados> dadosExistentes = dadosRepository.findByNomePocoIn(nomesPoco);
    
        for (Dados novoDado : novosDados) {

            Dados dadoExistente = dadosExistentes.stream()
                .filter(d -> d.getNomePoco().equals(novoDado.getNomePoco()))
                .findFirst()
                .orElse(null);
    
            if (dadoExistente != null) {
                boolean dadosAlterados = false;

                if (houveAlteracao(dadoExistente, novoDado)) {
                    atualizarDadosPrincipais(dadoExistente, novoDado);
                    dadosAlterados = true;
                }
                
                Bacia baciaExistente = dadoExistente.getBacias().stream()
                .filter(b -> b.getNome().equals(novoDado.getNomeBacia()))
                .findFirst().orElse(null);

                if(baciaExistente != null && !baciaExistente.getEstado().equals(novoDado.getEstado())){
                    baciaExistente.setEstado(novoDado.getEstado());
                    dadosAlterados = true;
                }

                Bloco blocoExistente = dadoExistente.getBlocos().stream()
                .filter(b -> b.getNome().equals(novoDado.getNomeBloco()))
                .findFirst().orElse(null);

                if(blocoExistente != null && blocoExistente.getNome().equals(novoDado.getNomeBloco())){
                    blocoExistente.setNome(novoDado.getNomeBloco());
                    dadosAlterados = true;
                }
                Campo campoExistente = dadoExistente.getCampos().stream()
                .filter(b -> b.getNome().equals(novoDado.getNomeCampo()))
                .findFirst().orElse(null);

                if(campoExistente != null && campoExistente.getNome().equals(novoDado.getNomeCampo())){
                    campoExistente.setNome(novoDado.getNomeCampo());
                    dadosAlterados = true;
                }
                Poco pocoExistente = dadoExistente.getPocos().stream()
                .filter(b -> b.getNome().equals(novoDado.getNomePoco()))
                .findFirst().orElse(null);

                if(pocoExistente != null && pocoExistente.getNome().equals(novoDado.getNomePoco())){
                    pocoService.atualizarPoco(pocoExistente, novoDado);
                    dadosAlterados = true;
                }
                if(dadosAlterados){
                    registrosAtualizados++;
                }
            
                }
            }                                                       
        dadosRepository.saveAll(dadosExistentes);                       
        return registrosAtualizados;
    }
        
    private List<Dados> parseCsv(MultipartFile file) throws IOException {
        try(Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))){
            HeaderColumnNameMappingStrategy<DadosCsvRpresentation> strategy = 
                new HeaderColumnNameMappingStrategy<>();
            strategy.setType(DadosCsvRpresentation.class);
            CsvToBean<DadosCsvRpresentation> csvtobean = 
                new CsvToBeanBuilder<DadosCsvRpresentation>(reader)
                .withMappingStrategy(strategy)
                .withSeparator(';')
                .withIgnoreEmptyLine(true)
                .withIgnoreLeadingWhiteSpace(true)
                .build();

                return csvtobean.parse()
                .stream()
                .map(csvLine -> {

                        Dados dados = Dados.builder()
                                                .estado(csvLine.getEstado())
                                                .nomeBacia(csvLine.getNomeBacia())
                                                .nomeBloco(csvLine.getNomeBloco())
                                                .nomeCampo(csvLine.getNomeCampo())
                                                .nomePoco(csvLine.getNomePoco())
                                                .inicio(csvLine.getInicio())
                                                .termino(csvLine.getTermino())
                                                .conclusao(csvLine.getConclusao())
                                                .laminaDagua(csvLine.getLaminaDagua())
                                                .reclassificacao(csvLine.getReclassificacao())
                                                .tipodePoco(csvLine.getTipodePoco())
                                                .categoria(csvLine.getCategoria())
                                                .situacao(csvLine.getSituacao())
                                                .latitude(csvLine.getLatitude())
                                                .longitude(csvLine.getLongitude())
                                                .pocoOperador(csvLine.getPocoOperador())
                                                .cadastro(csvLine.getCadastro())
                                                .build();

                    Bacia bacia = new Bacia();
                    bacia.setNome(csvLine.getNomeBacia());
                    bacia.setEstado(csvLine.getEstado());
                    bacia.setDados(dados);
                    dados.getBacias().add(bacia);

                    Bloco bloco = new Bloco();
                    bloco.setNome(csvLine.getNomeBloco());
                    bloco.setDados(dados);
                    bloco.setBacia(bacia);
                    dados.getBlocos().add(bloco);

                    Campo campo = new Campo();
                    campo.setNome(csvLine.getNomeCampo());
                    campo.setDados(dados);
                    campo.setBloco(bloco);
                    dados.getCampos().add(campo);

                    Poco poco = new Poco();
                    poco.setInicio(csvLine.getInicio());
                    poco.setTermino(csvLine.getTermino());
                    poco.setConclusao(csvLine.getConclusao());
                    poco.setNome(csvLine.getNomePoco());
                    poco.setReclassificacao(csvLine.getReclassificacao());
                    poco.setTipodePoco(csvLine.getTipodePoco());
                    poco.setCategoria(csvLine.getCategoria());
                    poco.setSituacao(csvLine.getSituacao());
                    poco.setLatitude(csvLine.getLatitude());
                    poco.setLongitude(csvLine.getLongitude());
                    poco.setPocoOperador(csvLine.getPocoOperador());
                    poco.setCadastro(csvLine.getCadastro());
                    poco.setCadastro(csvLine.getCadastro());
                    poco.setCampo(campo);
                    poco.setDados(dados);
                    dados.getPocos().add(poco);     

                    return dados;
                })
                .collect(Collectors.toList());

        } catch (Exception e) {
            throw new IOException("Erro inesperado ao processar o arquivo CSV.", e);
        }
    }

    private void atualizarDadosPrincipais(Dados dadoExistente, Dados novoDado){

        dadoExistente.setEstado(novoDado.getEstado());
        dadoExistente.setNomeBacia(novoDado.getNomeBacia());
        dadoExistente.setNomeBloco(novoDado.getNomeBloco());
        dadoExistente.setNomeCampo(novoDado.getNomeCampo());
        dadoExistente.setInicio(novoDado.getInicio());
        dadoExistente.setTermino(novoDado.getTermino());
        dadoExistente.setConclusao(novoDado.getConclusao());
        dadoExistente.setLaminaDagua(novoDado.getLaminaDagua());
        dadoExistente.setReclassificacao(novoDado.getReclassificacao());
        dadoExistente.setTipodePoco(novoDado.getTipodePoco());
        dadoExistente.setCategoria(novoDado.getCategoria());
        dadoExistente.setSituacao(novoDado.getSituacao());
        dadoExistente.setLatitude(novoDado.getLatitude());
        dadoExistente.setLongitude(novoDado.getLongitude());
        dadoExistente.setPocoOperador(novoDado.getPocoOperador());
        dadoExistente.setCadastro(novoDado.getCadastro());

    }

    private boolean houveAlteracao(Dados dadoExistente, Dados novoDado) {
        return !dadoExistente.getEstado().equals(novoDado.getEstado()) ||
               !dadoExistente.getNomeBacia().equals(novoDado.getNomeBacia()) ||
               !dadoExistente.getNomeBloco().equals(novoDado.getNomeBloco()) ||
               !dadoExistente.getNomeCampo().equals(novoDado.getNomeCampo()) ||
               !dadoExistente.getInicio().equals(novoDado.getInicio()) ||
               !dadoExistente.getTermino().equals(novoDado.getTermino()) ||
               !dadoExistente.getConclusao().equals(novoDado.getConclusao()) ||
               !dadoExistente.getLaminaDagua().equals(novoDado.getLaminaDagua()) ||
               !dadoExistente.getReclassificacao().equals(novoDado.getReclassificacao()) ||
               !dadoExistente.getTipodePoco().equals(novoDado.getTipodePoco()) ||
               !dadoExistente.getCategoria().equals(novoDado.getCategoria()) ||
               !dadoExistente.getSituacao().equals(novoDado.getSituacao()) ||
               !dadoExistente.getLatitude().equals(novoDado.getLatitude()) ||
               !dadoExistente.getLongitude().equals(novoDado.getLongitude()) ||
               !dadoExistente.getPocoOperador().equals(novoDado.getPocoOperador()) ||
               !dadoExistente.getCadastro().equals(novoDado.getCadastro());
    }
}
