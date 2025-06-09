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

/**
 * Serviço responsável pela importação de dados a partir de arquivos CSV,
 * realizando a criação ou atualização de entidades Bacia, Bloco, Campo e Poço.
 */
@Service
@RequiredArgsConstructor
public class DadosService {

    // Repositórios para acesso ao banco de dados das entidades
    private final BaciaRepository baciaRepository;
    private final BlocoRepository blocoRepository;
    private final CampoRepository campoRepository;
    private final PocoRepository pocoRepository;

    // Formato de data utilizado no CSV
    DateTimeFormatter format = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /**
     * Importa dados de um arquivo CSV, criando ou atualizando registros no banco.
     * 
     * @param file Arquivo CSV enviado pelo usuário
     * @return Quantidade de registros criados/atualizados
     * @throws IOException Caso ocorra erro na leitura do arquivo
     */
    public Integer importarCsv(MultipartFile file) throws IOException {
        // Converte o CSV em uma lista de objetos de representação
        List<DadosCsvRpresentation> linhasCsv = parseCsv(file);
        int registrosCriados = 0;
    
        // Processa cada linha do CSV
        for (DadosCsvRpresentation csv : linhasCsv) {
    
            // 1. Verifica se a Bacia existe, senão cria uma nova
            Bacia bacia = baciaRepository.findByNomeAndEstado(csv.getNomeBacia(), csv.getEstado())
                 .orElseGet(() -> {
                     Bacia novaBacia = new Bacia();
                     novaBacia.setNome(csv.getNomeBacia());
                     novaBacia.setEstado(csv.getEstado());
                     return baciaRepository.save(novaBacia);
                 });
    
            // 2. Verifica se o Bloco existe na Bacia, senão cria um novo
            Bloco bloco = blocoRepository.findByNomeAndBacia(csv.getNomeBloco(), bacia)
                            .orElseGet(() -> {
                                Bloco novoBloco = new Bloco();
                                novoBloco.setNome(csv.getNomeBloco());
                                novoBloco.setBacia(bacia);
                                return blocoRepository.save(novoBloco);
                            });
    
            // 3. Verifica se o Campo existe no Bloco, senão cria um novo
            Campo campo = campoRepository.findByNomeAndBloco(csv.getNomeCampo(), bloco)
                            .orElseGet(() -> {
                                Campo novoCampo = new Campo();
                                novoCampo.setNome(csv.getNomeCampo());
                                novoCampo.setBloco(bloco);
                                return campoRepository.save(novoCampo);
                            });
    
            // 4. Verifica se o Poço existe no Campo, senão cria um novo (mas só salva depois)
            Poco poco = pocoRepository.findByNomeAndCampoId(csv.getNomePoco(), campo.getId())
                            .orElseGet(() -> {
                                Poco novoPoco = new Poco();
                                novoPoco.setNome(csv.getNomePoco());
                                novoPoco.setCampo(campo);
                                return novoPoco;
                            });
    
            // Atualiza os dados do poço conforme o CSV
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
    
            // Salva ou atualiza o poço no banco de dados
            pocoRepository.save(poco);
    
            registrosCriados++;
        }
    
        return registrosCriados;
    }
    
    /**
     * Converte o arquivo CSV em uma lista de objetos de representação.
     * 
     * @param file Arquivo CSV
     * @return Lista de DadosCsvRpresentation
     * @throws IOException Caso ocorra erro na leitura
     */
    private List<DadosCsvRpresentation> parseCsv(MultipartFile file) throws IOException {
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            // Define a estratégia de mapeamento pelo nome das colunas do cabeçalho
            HeaderColumnNameMappingStrategy<DadosCsvRpresentation> strategy =
                    new HeaderColumnNameMappingStrategy<>();
            strategy.setType(DadosCsvRpresentation.class);

            // Configura o parser do OpenCSV
            CsvToBean<DadosCsvRpresentation> csvToBean =
                    new CsvToBeanBuilder<DadosCsvRpresentation>(reader)
                            .withMappingStrategy(strategy)
                            .withSeparator(';')
                            .withIgnoreEmptyLine(true)
                            .withIgnoreLeadingWhiteSpace(true)
                            .build();

            // Realiza o parse e retorna a lista
            return csvToBean.parse();

        } catch (Exception e) {
            // Lança exceção caso ocorra erro inesperado
            throw new IOException("Erro inesperado ao processar o arquivo CSV.", e);
        }
    }
}
