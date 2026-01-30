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

# Temporary use nodejs to check coverage since bc seems to be absent of last images used in CI
# covered_avg=`echo "scale=4; (($covered_statements / $statements) + ($covered_conditionals / $conditionals) + ($covered_methods / $methods) + ($covered_elements / $elements)) / 4 * 100" | bc`;
covered_avg=$(node -e '
  const [cs,s,cc,c,cm,m,ce,e]=process.argv.slice(1).map(Number);
  const r=(x,y)=>y>0?x/y:0;
  const v=((r(cs,s)+r(cc,c)+r(cm,m)+r(ce,e))/4)*100;
  process.stdout.write(v.toFixed(4));
' "$covered_statements" "$statements" "$covered_conditionals" "$conditionals" "$covered_methods" "$methods" "$covered_elements" "$elements")

# Strip "0" values
covered_avg=`echo $covered_avg | head -c 5`;

echo ""
echo "Global coverage is: [$covered_avg%]"
echo "Check your \"coverage\" folder for detailed informations"
