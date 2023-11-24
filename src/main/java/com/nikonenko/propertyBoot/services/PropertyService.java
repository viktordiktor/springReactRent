package com.nikonenko.propertyBoot.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonAppend;
import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.models.PropertyType;
import com.nikonenko.propertyBoot.repositories.PropertyRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.math.BigDecimal;
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
        Page<Property> page = propertyRepository.findAllExisting(pageable);

        List<Property> properties = page.getContent()
                .stream()
                .filter(property -> !property.isDeleted())
                .collect(Collectors.toList());

        return new PageImpl<>(properties, pageable, page.getTotalElements());
    }

    public Page<Property> findFilteredProperties(PropertyType propertyType, BigDecimal minPrice, BigDecimal maxPrice,
                                                 String sortField, String sortType,
                                                 int pageNumber, int pageSize) {
        Specification<Property> specification = buildSpecification(propertyType, minPrice, maxPrice);
        Sort sort = buildSort(sortField, sortType);
        Pageable pageable = buildPageable(pageNumber, pageSize, sort);
        return propertyRepository.findAll(specification, pageable);
    }

    private Specification<Property> buildSpecification(PropertyType propertyType, BigDecimal minPrice, BigDecimal maxPrice) {
        return Specification.where((root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            predicate = criteriaBuilder.and(predicate,
                    criteriaBuilder.equal(root.get("deleted"), false));
            if (propertyType != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("type"), propertyType));
            }
            if (minPrice != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            return predicate;
        });
    }

    private Sort buildSort(String sortField, String sortType) {
        Sort sort = null;
        if (sortField != null) {
            switch (sortField) {
                case "rooms" -> sort = Sort.by("rooms");
                case "square" -> sort = Sort.by("square");
                case "price" -> sort = Sort.by("price");
            }
            if (sortType != null && sortType.equalsIgnoreCase("DESC")) {
                assert sort != null;
                sort = sort.descending();
            }
        }
        return sort;
    }

    private Pageable buildPageable(int pageNumber, int pageSize, Sort sort) {
        if (sort != null) {
            return PageRequest.of(pageNumber, pageSize, sort);
        } else {
            return PageRequest.of(pageNumber, pageSize);
        }
    }

    public Property parsePropertyData(String propertyData) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(propertyData, Property.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Property> findWithDeleted() {
        return propertyRepository.findAll();
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
    public Property update(Integer id, Property updatedProperty){
        updatedProperty.setId(id);
        return propertyRepository.save(updatedProperty);
    }

    @Transactional
    public void softDelete(Integer id){
        propertyRepository.softDeleteById(id);
    }

    @Transactional
    public void hardDelete(Property property){propertyRepository.delete(property);}

    @Transactional
    public void restore(Integer id){
        propertyRepository.restoreById(id);
    }
}
