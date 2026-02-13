#!/bin/bash

# Script to launch all combinations of command-elastic commands
# Generates and executes:
# - elastic-transform for all product/range/pivot combinations
# - elastic-reindex for all product/range/pivot/key combinations

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Arrays of parameter values
products=("franceconnect" "franceconnect_plus")
ranges=("month" "semester" "year")
pivots=("sp" "idp" "sp_idp_pair" "idp_public_sp" "idp_private_sp")
keys=("nbOfIdentities" "nbOfConnections")

# Base command
BASE_CMD="docker-stack command command-elastic command-elastic"

# Counter for tracking executions
elastic_transform_count=0
elastic_reindex_count=0

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Elastic Commands Launcher${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Function to execute a command
execute_command() {
  local cmd=$1
  echo -e "${GREEN}[$((elastic_transform_count + elastic_reindex_count + 1))]${NC} Executing: $cmd"
  eval "$cmd"
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Success${NC}"
  else
    echo -e "${RED}✗ Failed${NC}"
  fi
  echo ""
}

echo -e "${YELLOW}Running all elastic-transform commands...${NC}"
echo "(Total combinations: $((${#products[@]} * ${#ranges[@]} * ${#pivots[@]})))"
echo ""

for product in "${products[@]}"; do
  for range in "${ranges[@]}"; do
    for pivot in "${pivots[@]}"; do
      cmd="$BASE_CMD elastic-transform --product=$product --range=$range --pivot=$pivot"
      execute_command "$cmd"
      ((elastic_transform_count++))
    done
  done
done

# Add 5 minutes before running watcher commands
echo -e "${YELLOW}Waiting 5 minutes before launching watcher commands...${NC}"
sleep 300

for product in "${products[@]}"; do
  for range in "${ranges[@]}"; do
    for pivot in "${pivots[@]}"; do
      cmd="$BASE_CMD elastic-transform-watcher --product=$product --range=$range --pivot=$pivot"
      execute_command "$cmd"
      ((elastic_transform_count++))
    done
  done
done

echo ""
echo -e "${YELLOW}Running all elastic-reindex commands...${NC}"
echo "(Total combinations: $((${#products[@]} * ${#ranges[@]} * ${#pivots[@]} * ${#keys[@]})))"
echo ""

for product in "${products[@]}"; do
  for range in "${ranges[@]}"; do
    for pivot in "${pivots[@]}"; do
      for key in "${keys[@]}"; do
        cmd="$BASE_CMD elastic-reindex --product=$product --range=$range --pivot=$pivot --key=$key"
        execute_command "$cmd"
        ((elastic_reindex_count++))
      done
    done
  done
done

# Add 5 minutes before running watcher commands
echo -e "${YELLOW}Waiting 5 minutes before launching watcher commands...${NC}"
sleep 300

for product in "${products[@]}"; do
  for range in "${ranges[@]}"; do
    for pivot in "${pivots[@]}"; do
      for key in "${keys[@]}"; do
        cmd="$BASE_CMD elastic-reindex-watcher --product=$product --range=$range --pivot=$pivot --key=$key"
        execute_command "$cmd"
        ((elastic_reindex_count++))
      done
    done
  done
done

echo -e "${YELLOW}========================================${NC}"
echo -e "${GREEN}All commands completed!${NC}"
echo -e "${YELLOW}========================================${NC}"
echo "elastic-transform commands executed: $elastic_transform_count"
echo "elastic-reindex commands executed: $elastic_reindex_count"
echo "Total commands executed: $((elastic_transform_count + elastic_reindex_count))"
