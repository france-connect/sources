#!/bin/bash

global=`cat ./coverage/clover.xml | grep "<metrics" | head -n 1 | sed -e 's/[^0-9 ]//g'`

statements=`echo -n $global | cut -f1 -d ' '`;
covered_statements=`echo -n $global | cut -f2 -d ' '`;

conditionals=`echo -n $global | cut -f3 -d ' '`;
covered_conditionals=`echo -n $global | cut -f4 -d ' '`;

methods=`echo -n $global | cut -f5 -d ' '`;
covered_methods=`echo -n $global | cut -f6 -d ' '`;

elements=`echo -n $global | cut -f7 -d ' '`;
covered_elements=`echo -n $global | cut -f8 -d ' '`;

covered_avg=`echo "scale=4; (($covered_statements / $statements) + ($covered_conditionals / $conditionals) + ($covered_methods / $methods) + ($covered_elements / $elements)) / 4 * 100" | bc`;
# Strip "0" values
covered_avg=`echo $covered_avg | head -c 5`;

echo ""
echo "Global coverage is: [$covered_avg%]"
echo "Check your \"coverage\" folder for detailed informations"
