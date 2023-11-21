package com.nikonenko.propertyBoot.repositories;

import com.nikonenko.propertyBoot.models.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Integer> {
    List<Image> findByPropertyId(Integer propertyId);
    void deleteByPropertyId(Integer propertyId);
}
