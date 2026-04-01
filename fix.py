import re

with open('test-data.sql', 'r') as f:
    content = f.read()

# Remove column from INSERT statement
content = content.replace(" question2,", "")

# The answers for question2 are single words enclosed in quotes followed by a comma
# Let's see the lines.
lines = content.split('\n')
new_lines = []
for line in lines:
    if re.match(r"^ '[A-ZÀ-ÿ][a-zà-ÿ]+',$", line):
        continue
    new_lines.append(line)

with open('test-data.sql', 'w') as f:
    f.write('\n'.join(new_lines))
