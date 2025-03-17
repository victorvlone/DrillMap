package com.drillmap.backend.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.drillmap.backend.entities.Bacia;
import com.drillmap.backend.entities.Bloco;
import com.drillmap.backend.entities.Campo;
import com.drillmap.backend.entities.Poco;
import com.drillmap.backend.repositories.BaciaRepository;
import com.drillmap.backend.repositories.BlocoRepository;
import com.drillmap.backend.repositories.CampoRepository;
import com.drillmap.backend.repositories.PocoRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DadosService {

    private final BaciaRepository baciaRepository;
    private final BlocoRepository blocoRepository;
    private final CampoRepository campoRepository;
    private final PocoRepository pocoRepository;

    DateTimeFormatter format = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    public Integer importarCsv(MultipartFile file) throws IOException {
        List<DadosCsvRpresentation> linhasCsv = parseCsv(file); // Método que converte CSV em lista de representações
        int registrosCriados = 0;
    
        for (DadosCsvRpresentation csv : linhasCsv) {
    
            // 1. Verificar ou criar a Bacia
            Bacia bacia = baciaRepository.findByNomeAndEstado(csv.getNomeBacia(), csv.getEstado())
                 .orElseGet(() -> {
                     Bacia novaBacia = new Bacia();
                     novaBacia.setNome(csv.getNomeBacia());
                     novaBacia.setEstado(csv.getEstado());
                     return baciaRepository.save(novaBacia);
                 });
    
            // 2. Verificar ou criar o Bloco dentro da Bacia
            Bloco bloco = blocoRepository.findByNomeAndBacia(csv.getNomeBloco(), bacia)
                            .orElseGet(() -> {
                                Bloco novoBloco = new Bloco();
                                novoBloco.setNome(csv.getNomeBloco());
                                novoBloco.setBacia(bacia);
                                return blocoRepository.save(novoBloco);
                            });
    
            // 3. Verificar ou criar o Campo dentro do Bloco
            Campo campo = campoRepository.findByNomeAndBloco(csv.getNomeCampo(), bloco)
                            .orElseGet(() -> {
                                Campo novoCampo = new Campo();
                                novoCampo.setNome(csv.getNomeCampo());
                                novoCampo.setBloco(bloco);
                                return campoRepository.save(novoCampo);
                            });
    
            // 4. Verificar ou criar o Poço dentro do Campo
            Poco poco = pocoRepository.findByNomeAndCampoId(csv.getNomePoco(), campo.getId())
                            .orElseGet(() -> {
                                Poco novoPoco = new Poco();
                                novoPoco.setNome(csv.getNomePoco());
                                novoPoco.setCampo(campo);
                                return novoPoco;
                            });
    
            // Atualizar os dados do poço se necessário
            if (poco.getCampo() != null && !poco.getCampo().equals(campo)) {
                poco.setCampo(campo); // Atualiza o campo, se necessário
            }
            if (csv.getInicio() != null && !csv.getInicio().isBlank()) {
                poco.setInicio(LocalDate.parse(csv.getInicio(), format));
            }  
            if (csv.getTermino() != null && !csv.getTermino().isBlank()) {
                poco.setTermino(LocalDate.parse(csv.getTermino(), format));
            }
            if (csv.getConclusao() != null && !csv.getConclusao().isBlank()) {
                poco.setConclusao(LocalDate.parse(csv.getConclusao(), format));
            }
            poco.setReclassificacao(csv.getReclassificacao());
            poco.setTipodePoco(csv.getTipodePoco());
            poco.setCategoria(csv.getCategoria());
            poco.setSituacao(csv.getSituacao());
            poco.setLatitude(Double.valueOf(csv.getLatitude().replace(",", ".")));
            poco.setLongitude(Double.valueOf(csv.getLongitude().replace(",", ".")));
            poco.setPocoOperador(csv.getPocoOperador());
            poco.setCadastro(csv.getCadastro());
    
            // Salva ou atualiza o poço
            pocoRepository.save(poco);
    
            registrosCriados++;
        }
    
        return registrosCriados;
    }
    
        
    private List<DadosCsvRpresentation> parseCsv(MultipartFile file) throws IOException {
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            HeaderColumnNameMappingStrategy<DadosCsvRpresentation> strategy =
                    new HeaderColumnNameMappingStrategy<>();
            strategy.setType(DadosCsvRpresentation.class);

            CsvToBean<DadosCsvRpresentation> csvToBean =
                    new CsvToBeanBuilder<DadosCsvRpresentation>(reader)
                            .withMappingStrategy(strategy)
                            .withSeparator(';')
                            .withIgnoreEmptyLine(true)
                            .withIgnoreLeadingWhiteSpace(true)
                            .build();

            return csvToBean.parse();

        } catch (Exception e) {
            throw new IOException("Erro inesperado ao processar o arquivo CSV.", e);
        }
    }
}
