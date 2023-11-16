package com.nikonenko.propertyBoot.repositories;

import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.models.Property;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Integer> {
}
