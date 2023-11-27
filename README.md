# Spring + Hibernate + React + Lombok + JWT App

# Quick Start

    # clone repo
    git clone https://github.com/viktordiktor/springReactRent.git
    
    # change directory to repo
    cd springReactRent
    
    # install the repo with mvn
    mvn install

    # edit database settings in application.yml
    datasource:
    url: jdbc:postgresql://localhost:5432/*your_postgre_db*
    username: *your_username*
    password: *your_password*
    
    # start the server
    mvn spring-boot:run

    # start the react frontend (open another terminal)
    cd frontend
    npm install 
    npm start
    
    # main page: http://localhost:3000/props
    # swagger docs: http://localhost:8080/swagger-ui/index.html
    # there are two built-in user accounts to demonstrate the differing levels of access to the endpoints:
    # - User - email: user@test.ru   password: user
    # - Admin - email: admin@test.ru    password: admin
