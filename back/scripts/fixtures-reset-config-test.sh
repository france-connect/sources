#!/bin/bash

sqlDeleteConfigs="delete from service_provider_configuration spc 
using service_provider sp
where sp.id = spc.\"serviceProviderId\" 
and sp.name = 'Service Provider - Configuration Test'"

yarn typeorm query -d ./typeorm.config.ts "$sqlDeleteConfigs"

sqlResetConfigIncrement="update service_provider
set \"configurationNumberIncrement\" = 0
where name = 'Service Provider - Configuration Test'"

yarn typeorm query -d ./typeorm.config.ts "$sqlResetConfigIncrement"
