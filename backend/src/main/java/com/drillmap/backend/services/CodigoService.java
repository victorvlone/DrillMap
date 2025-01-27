package com.drillmap.backend.services;

public class CodigoService {

    private static String codigoAtual;

    public static String gerarCodigo(){
        codigoAtual = String.valueOf((int) (Math.random() * 9000) + 1000);
        return codigoAtual;
    }

}
