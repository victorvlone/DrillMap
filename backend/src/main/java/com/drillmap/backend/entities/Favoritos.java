package com.drillmap.backend.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa um favorito de um usuário para um poço.
 * Cada favorito é único por usuário e poço.
 */
@Entity
@Table(name = "favoritos", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"id_usuario", "id_poco"})
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Favoritos {

    // Identificador único do favorito (chave primária)
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name= "id_favorito")
    private Integer id;

    // Usuário que favoritou o poço (relacionamento muitos-para-um)
    @ManyToOne
    @JoinColumn(name= "id_usuario")
    private Usuario usuario;

    // Poço favoritado (relacionamento muitos-para-um)
    @ManyToOne
    @JoinColumn(name= "id_poco")
    private Poco poco;

    // Momento em que o favorito foi criado
    private LocalDateTime momento = LocalDateTime.now();
}
