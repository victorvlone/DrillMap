package com.drillmap.backend.services;

import org.springframework.stereotype.Service;

import com.drillmap.backend.entities.Dados;
import com.drillmap.backend.entities.Poco;

@Service
public class PocoService {

    public boolean houveAlteracaoPoco(Poco existente, Dados novo){
        return !existente.getNome().equals(novo.getNomePoco()) ||
               !existente.getTipodePoco().equals(novo.getTipodePoco()) ||
               !existente.getSituacao().equals(novo.getSituacao()) ||
               !existente.getLatitude().equals(novo.getLatitude()) ||
               !existente.getLongitude().equals(novo.getLongitude()) ||
               !existente.getInicio().equals(novo.getInicio()) ||
               !existente.getTermino().equals(novo.getTermino()) ||
               !existente.getConclusao().equals(novo.getConclusao()) ||
               !existente.getReclassificacao().equals(novo.getReclassificacao()) ||
               !existente.getPocoOperador().equals(novo.getPocoOperador());
    }

    public void atualizarPoco(Poco existente, Dados novo){
        existente.setNome(novo.getNomePoco());
        existente.setTipodePoco(novo.getTipodePoco());
        existente.setSituacao(novo.getSituacao());
        existente.setLatitude(novo.getLatitude());
        existente.setLongitude(novo.getLongitude());
        existente.setInicio(novo.getInicio());
        existente.setTermino(novo.getTermino());
        existente.setConclusao(novo.getConclusao());
        existente.setReclassificacao(novo.getReclassificacao()); 
        existente.setCategoria(novo.getCategoria());
        existente.setPocoOperador(novo.getPocoOperador());
    }
    

}
