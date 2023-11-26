package com.nikonenko.propertyBoot.services;

import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.repositories.PersonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PersonServiceTest {

    @Mock
    private PersonRepository mockPersonRepository;

    private PersonService personServiceUnderTest;

    @BeforeEach
    void setUp() {
        personServiceUnderTest = new PersonService(mockPersonRepository);
    }

    @Test
    void testFindAll() {
        final List<Person> expectedResult = List.of(Person.builder()
                .id(0)
                .build());

        final List<Person> people = List.of(Person.builder()
                .id(0)
                .build());
        when(mockPersonRepository.findAll()).thenReturn(people);

        final List<Person> result = personServiceUnderTest.findAll();

        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testFindAll_PersonRepositoryReturnsNoItems() {
        when(mockPersonRepository.findAll()).thenReturn(Collections.emptyList());

        final List<Person> result = personServiceUnderTest.findAll();

        assertThat(result).isEqualTo(Collections.emptyList());
    }

    @Test
    void testFindOne() {
        final Optional<Person> expectedResult = Optional.of(Person.builder()
                .id(0)
                .build());

        final Optional<Person> person = Optional.of(Person.builder()
                .id(0)
                .build());
        when(mockPersonRepository.findById(0)).thenReturn(person);

        final Optional<Person> result = personServiceUnderTest.findOne(0);

        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testFindOne_PersonRepositoryReturnsAbsent() {
        when(mockPersonRepository.findById(0)).thenReturn(Optional.empty());

        final Optional<Person> result = personServiceUnderTest.findOne(0);

        assertThat(result).isEmpty();
    }

    @Test
    void testSave() {
        final Person person = Person.builder()
                .id(0)
                .build();

        personServiceUnderTest.save(person);

        verify(mockPersonRepository).save(Person.builder()
                .id(0)
                .build());
    }

    @Test
    void testUpdate() {
        final Person updatedPerson = Person.builder()
                .id(0)
                .build();

        personServiceUnderTest.update(0, updatedPerson);

        verify(mockPersonRepository).save(Person.builder()
                .id(0)
                .build());
    }
}
