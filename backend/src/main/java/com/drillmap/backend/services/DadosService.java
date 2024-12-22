package com.drillmap.backend.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.drillmap.backend.entities.Dados;
import com.drillmap.backend.repositories.DadosRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DadosService {

    @Autowired
    private final DadosRepository dadosRepository;

    public Integer uploadDados(MultipartFile file) throws IOException {
        List<Dados> dados = parseCsv(file);
        dadosRepository.saveAll(dados);

        return dados.size();
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
                    .map(csvLine -> Dados.builder()
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
                                                .build()

                    ).collect(Collectors.toList());
        } catch (Exception e) {
            throw new IOException("Erro inesperado ao processar o arquivo CSV.", e);
        }
    }
}
