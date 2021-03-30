this file is very work-in-progress.

get the names, dates, and blocks from all trials. basically if it's got str < 7 and contains PDN, then it might be good. (go through the entire dataset and put each row in either doesnotcontain pdn or contains pdn.

add no blocks + contains pdn together, call this 'candidates'

then, we want to remove some entries from the dataframe of candidates (no blocks or contains pdn))

we want to removes entries from this dataframe that are also in the original input have a string length of > 7 or doesnotcontain PDN. (so, use doesnotcontain pdn and if block str > 7)


