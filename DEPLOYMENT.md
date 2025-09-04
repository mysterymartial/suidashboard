# Sui Transaction Analyser Deployment Guide

This guide provides detailed instructions for deploying the Sui Transaction Analyser to various cloud providers.

## Prerequisites

- Git repository with your Sui Transaction Analyser code
- Docker and Docker Compose installed (for local testing)
- Hugging Face API token

## Docker Deployment (Local)

1. Clone the repository:

```bash
git clone <repository-url>
cd sui-transaction-analyser
```

2. Update the `.env` file with your configuration:

```
# API Configuration
DEBUG=False  # Set to False for production
API_HOST=0.0.0.0
API_PORT=8000

# Hugging Face Configuration
HF_MODEL=microsoft/DialoGPT-medium
HF_API_URL=https://api-inference.huggingface.co/models
HF_TOKEN=your_huggingface_token

# Database Configuration
DATABASE_URL=sqlite:///./data/sui_tax_analysis.db

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
```

3. Build and start the Docker container:

```bash
docker-compose up -d
```

4. Verify the application is running:

```bash
curl http://localhost:8000/health
```

## Cloud Deployment Options

### 1. Render

Render offers a straightforward deployment process with Docker support.

1. Create a Render account at [render.com](https://render.com)

2. Create a new Web Service and select "Deploy from GitHub repo"

3. Connect your GitHub repository

4. Configure the service:
   - **Name**: sui-transaction-analyser
   - **Environment**: Docker
   - **Branch**: main (or your preferred branch)
   - **Region**: Choose the closest to your users

5. Add environment variables (same as in `.env` file)

6. Click "Create Web Service"

7. Render will automatically build and deploy your application

### 2. Back4app

Back4app provides a Container as a Service platform with GitHub integration.

1. Create a Back4app account at [back4app.com](https://back4app.com)

2. Create a new Container app

3. Connect your GitHub repository

4. Configure the container:
   - **Docker file path**: ./Dockerfile
   - **Port**: 8000

5. Add environment variables (same as in `.env` file)

6. Deploy the container

### 3. Koyeb

Koyeb supports both git-driven and container-based deployment.

1. Create a Koyeb account at [koyeb.com](https://koyeb.com)

2. Create a new application

3. Choose deployment method:
   - **Git-driven**: Connect to your GitHub repository
   - **Container-based**: Use your Docker image

4. Configure the service:
   - **Name**: sui-transaction-analyser
   - **Region**: Choose the closest to your users
   - **Instance Type**: Select based on your needs

5. Add environment variables (same as in `.env` file)

6. Deploy the application

## Database Considerations

The default configuration uses SQLite, which is suitable for development and small-scale deployments. For production environments with higher traffic, consider migrating to a more robust database solution:

### PostgreSQL Migration

1. Update the `DATABASE_URL` in your environment variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
```

2. Add PostgreSQL dependencies to `requirements.txt`:

```
asyncpg==0.27.0
```

3. Update the database connection code in `app/core/database.py` to use PostgreSQL

## Scaling Considerations

### Horizontal Scaling

For higher traffic loads, consider implementing horizontal scaling:

1. Use a load balancer to distribute traffic across multiple instances
2. Implement a shared database solution
3. Consider using Redis for caching and session management

### Vertical Scaling

Increase resources for your deployment:

1. Upgrade to a higher tier on your cloud provider
2. Increase CPU and memory allocations

## Monitoring and Maintenance

1. Set up health check monitoring
2. Implement logging with a service like Datadog or New Relic
3. Create automated backups for your database
4. Set up alerts for critical errors or performance issues

## Security Best Practices

1. Keep all dependencies updated
2. Implement proper authentication for production deployments
3. Use HTTPS for all traffic
4. Regularly audit your application for security vulnerabilities
5. Store sensitive information (like API keys) in environment variables, not in code

## Troubleshooting

### Common Issues

1. **Application not starting**: Check logs for errors, verify environment variables
2. **Database connection issues**: Verify database URL and credentials
3. **API rate limiting**: Adjust rate limiting parameters in environment variables
4. **Memory issues**: Increase container memory allocation

### Viewing Logs

Most cloud providers offer built-in log viewing:

- **Render**: Logs tab in the service dashboard
- **Back4app**: Logs section in the container details
- **Koyeb**: Logs tab in the service overview

## Conclusion

By following this deployment guide, you should be able to successfully deploy the Sui Transaction Analyser to your preferred cloud provider. For additional support or questions, refer to the technical documentation or contact the development team.