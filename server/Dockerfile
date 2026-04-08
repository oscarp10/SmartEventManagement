# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish src/SmartEventManagement.API/SmartEventManagement.API.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
# Render injects PORT at runtime; shell form expands $PORT when the container starts.
CMD ASPNETCORE_URLS=http://0.0.0.0:$PORT dotnet SmartEventManagement.API.dll
