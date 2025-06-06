FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["DevSocial.API/DevSocial.API.csproj", "DevSocial.API/"]
RUN dotnet restore "DevSocial.API/DevSocial.API.csproj"
COPY . .
WORKDIR "/src/DevSocial.API"
RUN dotnet build "DevSocial.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DevSocial.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DevSocial.API.dll"] 