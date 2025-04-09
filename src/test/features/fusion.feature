Feature: Fusion API

  Background:
    Given el sistema está inicializado

  Scenario: Obtener datos fusionados sin caché
    Given que el sistema no tiene datos en caché
    When se realiza una petición GET a "/fusionados"
    Then se deben obtener datos fusionados de StarWars y D&D almacenados en DynamoDB

  Scenario: Almacenar un nuevo registro fusionado
    Given que no existe un registro con namePlanet "Tatooine" y monster "Fireball"
    When se realiza una petición POST a "/almacenar" con el siguiente payload:
      """
      {
        "namePlanet": "Tatooine",
        "climate": "arid",
        "terrain": "desert",
        "population": "200000",
        "monster": "Fireball",
        "threatLevel": 3
      }
      """
    Then la respuesta debe indicar que el registro fue almacenado exitosamente

  Scenario: Intentar almacenar un registro ya existente
    Given que ya existe un registro con namePlanet "Tatooine" y monster "Fireball"
    When se realiza una petición POST a "/almacenar" con el siguiente payload:
      """
      {
        "namePlanet": "Tatooine",
        "climate": "arid",
        "terrain": "desert",
        "population": "200000",
        "monster": "Fireball",
        "threatLevel": 3
      }
      """
    Then la respuesta debe indicar que el registro ya se encuentra registrado

  Scenario: Obtener historial con paginación
    When se realiza una petición GET a "/historial?page=1&limit=10"
    Then la respuesta debe contener un listado de registros ordenados cronológicamente
