package com.drillmap.backend.services;

import org.springframework.stereotype.Service;

import com.drillmap.backend.repositories.BaciaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BaciaService {

    private final BaciaRepository repository;

}
