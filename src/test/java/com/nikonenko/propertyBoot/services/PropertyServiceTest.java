package com.nikonenko.propertyBoot.services;

import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.models.PropertyType;
import com.nikonenko.propertyBoot.repositories.PropertyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository mockPropertyRepository;

    private PropertyService propertyServiceUnderTest;

    @BeforeEach
    void setUp() {
        propertyServiceUnderTest = new PropertyService(mockPropertyRepository);
    }

    @Test
    void testFindAll() {
        final Page<Property> properties = new PageImpl<>(List.of(Property.builder()
                .id(0)
                .deleted(false)
                .build()));
        when(mockPropertyRepository.findAllExisting(any(Pageable.class))).thenReturn(properties);

        final Page<Property> result = propertyServiceUnderTest.findAll(0, 1);

        assertThat(result.getContent()).isEqualTo(properties.getContent());
    }

    @Test
    void testFindAll_PropertyRepositoryReturnsNoItems() {
        when(mockPropertyRepository.findAllExisting(any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));

        final Page<Property> result = propertyServiceUnderTest.findAll(0, 1);

        assertThat(result).isEmpty();
    }

    @Test
    void testFindFilteredProperties() {

        final Page<Property> properties = new PageImpl<>(List.of(Property.builder()
                .id(0)
                .deleted(false)
                .build()));
        when(mockPropertyRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(properties);

        final Page<Property> result = propertyServiceUnderTest.findFilteredProperties(PropertyType.HOUSE,
                new BigDecimal("0.00"), new BigDecimal("0.00"), "sortField", "sortType", 0, 1);

        assertThat(result).isEqualTo(properties);
    }

    @Test
    void testFindFilteredProperties_PropertyRepositoryReturnsNoItems() {
        when(mockPropertyRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));

        final Page<Property> result = propertyServiceUnderTest.findFilteredProperties(PropertyType.HOUSE,
                new BigDecimal("0.00"), new BigDecimal("0.00"), "sortField", "sortType", 0, 1);

        assertThat(result).isEmpty();
    }


    @Test
    void testFindOne() {
        final Optional<Property> expectedResult = Optional.of(Property.builder()
                .id(0)
                .deleted(false)
                .build());
        final Optional<Property> property = Optional.of(Property.builder()
                .id(0)
                .deleted(false)
                .build());
        when(mockPropertyRepository.findById(0)).thenReturn(property);

        final Optional<Property> result = propertyServiceUnderTest.findOne(0);

        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testFindOne_PropertyRepositoryReturnsAbsent() {
        when(mockPropertyRepository.findById(0)).thenReturn(Optional.empty());

        final Optional<Property> result = propertyServiceUnderTest.findOne(0);

        assertThat(result).isEmpty();
    }

    @Test
    void testSave() {
        final Property property = Property.builder()
                .id(0)
                .deleted(false)
                .build();
        when(mockPropertyRepository.save(property)).thenReturn(property);

        final Property result = propertyServiceUnderTest.save(property);

        assertThat(result).isEqualTo(property);
    }

    @Test
    void testUpdate() {
        // Setup
        final Property updatedProperty = Property.builder()
                .id(0)
                .deleted(false)
                .build();
        final Property expectedResult = Property.builder()
                .id(0)
                .deleted(false)
                .build();
        when(mockPropertyRepository.save(updatedProperty)).thenReturn(expectedResult);

        // Run the test
        final Property result = propertyServiceUnderTest.update(0, updatedProperty);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testSoftDelete() {
        propertyServiceUnderTest.softDelete(0);

        verify(mockPropertyRepository).softDeleteById(0);
    }

    @Test
    void testHardDelete() {
        final Property property = Property.builder()
                .id(0)
                .deleted(false)
                .build();

        propertyServiceUnderTest.hardDelete(property);

        verify(mockPropertyRepository).delete(property);
    }

    @Test
    void testRestore() {
        propertyServiceUnderTest.restore(0);

        verify(mockPropertyRepository).restoreById(0);
    }
}