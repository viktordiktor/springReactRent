package com.nikonenko.propertyBoot.services;

import com.fasterxml.jackson.databind.annotation.JsonAppend;
import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.repositories.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PropertyService {
    private final PropertyRepository propertyRepository;

    @Autowired
    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public Page<Property> findAll(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Property> page = propertyRepository.findAll(pageable);

        List<Property> properties = page.getContent()
                .stream()
                .filter(property -> !property.isDeleted())
                .collect(Collectors.toList());

        return new PageImpl<>(properties, pageable, page.getTotalElements());
    }

    public Page<Property> findAllSorted(int pageNumber, int pageSize, String sortBy) {
        Sort sort = Sort.by(sortBy.split(",")[0]);
        sort = sortBy.split(",")[1].equalsIgnoreCase("asc") ? sort.ascending() : sort.descending();
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sort);
        return propertyRepository.findAll(pageRequest);
    }

    public Optional<Property> findOne(Integer id){
        return propertyRepository.findById(id);
    }

    @Transactional
    public Property save(Property property){
        return propertyRepository.save(property);
    }

    @Transactional
    public Property update(Long id, Property updatedProperty){
        updatedProperty.setId(id);
        return propertyRepository.save(updatedProperty);
    }

    @Transactional
    public void delete(int id) {
        Optional<Property> propertyOptional = propertyRepository.findById(id);
        if (propertyOptional.isPresent()) {
            Property property = propertyOptional.get();
            property.setDeleted(true);
            propertyRepository.save(property);
        } else {
            throw new RuntimeException("Property not found with id: " + id);
        }
    }
}
