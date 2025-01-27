package com.drillmap.backend.services;

import org.springframework.stereotype.Service;

import com.drillmap.backend.repositories.BlocoRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class BlocoService {

    private BlocoRepository repository;

}
