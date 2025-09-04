# SUI Transaction Analyzer Tests

This directory contains unit tests for the SUI Transaction Analyzer application. The tests cover all services, API endpoints, and include boundary analysis for edge cases.

## Test Structure

- **services_test.py**: Unit tests for all service functions in the `services` folder
  - Tests for `ai_service.py`
  - Tests for `tax_service.py`
  - Tests for `sui_service.py`

- **api_test.py**: Tests for API endpoints and request handling
  - Tests for transaction analysis endpoints
  - Tests for error handling

- **boundary_test.py**: Specific tests for edge cases and boundary conditions
  - Tests extreme values
  - Tests error handling
  - Tests invalid inputs

## Running Tests

To run all tests:

```bash
python -m unittest discover app/tests
```

To run a specific test file:

```bash
python -m unittest app/tests/services_test.py
```

To run a specific test class:

```bash
python -m unittest app.tests.services_test.TestAIService
```

To run a specific test method:

```bash
python -m unittest app.tests.services_test.TestAIService.test_analyze_transaction_success
```

## Test Coverage

These tests cover:

1. **Functionality Tests**:
   - All methods in service classes
   - API endpoints
   - Response formats

2. **Boundary Analysis**:
   - Empty inputs
   - Extreme values
   - Invalid data formats
   - Error handling

3. **Integration**:
   - Service interactions
   - API request/response flow

## Mocking Strategy

The tests use Python's `unittest.mock` to mock:

- External API calls (Hugging Face, SUI RPC)
- Database interactions
- Inter-service dependencies

This ensures tests are fast, reliable, and don't depend on external services.