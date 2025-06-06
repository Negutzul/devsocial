# Build the Angular frontend
FROM node:20 AS frontend-build
WORKDIR /app
COPY DevSocial.Web/package*.json ./
RUN npm install
COPY DevSocial.Web/ ./
RUN npm run build

# Build the .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src
COPY DevSocial.API/DevSocial.API.csproj DevSocial.API/
RUN dotnet restore "DevSocial.API/DevSocial.API.csproj"
COPY DevSocial.API/ DevSocial.API/
RUN dotnet build "DevSocial.API/DevSocial.API.csproj" -c Release -o /app/build

FROM backend-build AS backend-publish
RUN dotnet publish "DevSocial.API/DevSocial.API.csproj" -c Release -o /app/publish

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the published backend
COPY --from=backend-publish /app/publish .

# Copy the built frontend
COPY --from=frontend-build /app/dist/DevSocial.Web /app/wwwroot

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 80

ENTRYPOINT ["dotnet", "DevSocial.API.dll"] 