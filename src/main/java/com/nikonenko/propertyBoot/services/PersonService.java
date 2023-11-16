package com.nikonenko.propertyBoot.services;

import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class PersonService {
    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public List<Person> findAll(){
        return personRepository.findAll();
    }

    public Optional<Person> findOne(int id){
        return personRepository.findById(id);
    }

    @Transactional
    public void save(Person person){
        personRepository.save(person);
    }

    @Transactional
    public void update(Long id, Person updatedPerson){
        updatedPerson.setId(id);
        personRepository.save(updatedPerson);
    }

}
