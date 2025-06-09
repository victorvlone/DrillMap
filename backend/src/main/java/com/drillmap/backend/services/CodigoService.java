package com.drillmap.backend.services;

/**
 * Serviço utilitário para geração e armazenamento de um código numérico aleatório.
 * Pode ser utilizado, por exemplo, para validação de operações como autenticação em duas etapas.
 */
public class CodigoService {

    // Armazena o código gerado mais recentemente
    private static String codigoAtual;

    /**
     * Gera um código aleatório de 4 dígitos (entre 1000 e 9999) e armazena em codigoAtual.
     * 
     * @return O código gerado como String
     */
    public static String gerarCodigo(){
        codigoAtual = String.valueOf((int) (Math.random() * 9000) + 1000);
        return codigoAtual;
    }

}
