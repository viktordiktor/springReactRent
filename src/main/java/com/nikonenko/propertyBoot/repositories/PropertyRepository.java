package com.nikonenko.propertyBoot.repositories;

import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Integer> {
}
