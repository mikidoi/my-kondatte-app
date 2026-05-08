FROM node:22-alpine AS client-build
WORKDIR /app
COPY MyClient/package*.json ./
RUN npm ci
COPY MyClient/ .
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS server-build
WORKDIR /app
COPY MyApi/ .
COPY --from=client-build /app/dist ./wwwroot
RUN dotnet publish -c Release -o /publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=server-build /publish .
RUN mkdir -p wwwroot/images
EXPOSE 8080
CMD ["dotnet", "MyApi.dll"]
