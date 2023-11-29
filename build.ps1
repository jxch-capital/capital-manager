npm run build
# docker buildx create --use
docker buildx build --platform=linux/arm64,linux/amd64 -t jxch/capital-web:$(Get-Date -Format 'yyyyMMdd') -t jxch/capital-web:latest . --push
