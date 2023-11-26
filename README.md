# Spring + Hibernate + React + Lombok + JWT App

# Quick Start

    # clone repo
    # --depth 1 removes all but one .git commit history
    git clone --depth 1 https://github.com/viktordiktor/springReactRent.git
    
    # change directory to our repo
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
    npm start
    
    # main page: http://localhost:3000/props
    # swagger docs: http://localhost:8080/swagger-ui
    # there are two built-in user accounts to demonstrate the differing levels of access to the endpoints:
    # - User - email: user@test.ru   password: user
    # - Admin - email: admin@test.ru    password: admin
