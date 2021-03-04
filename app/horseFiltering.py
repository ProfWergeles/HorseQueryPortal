# takes a table generated by the database software and combines the measurement types

# -*- coding: utf-8 -*-
"""
Created on Tue Nov  3 14:24:17 2020

@author: royal
"""
# to use it to concatenate tables, you want to createTable from the input file
# then append more files to the first created table with appendCSV
# once enough tables are appended, you can run queryTableExport

import pandas as pd
import argparse
import numpy as np
#from multipledispatch import dispatch


#df = pd.DataFrame

# this helper function is straight from https://www.pythoncentral.io/how-to-check-if-a-string-is-a-number-in-python-including-unicode/
def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        pass
 
    try:
        import unicodedata
        unicodedata.numeric(s)
        return True
    except (TypeError, ValueError):
        pass
 
    return False

def createTable(inputfile):
    #print(inputfile)
    workingDf = pd.read_csv(inputfile)
    #print(workingDf)
    return workingDf

def appendCSV(workingDf, inputfile):
    df2 = createTable(inputfile)
    print("input from ", inputfile, df2)
    workingDf = pd.concat([workingDf, df2], ignore_index=True)
    return workingDf  

# what should we rename this function to? 
def nonCLI(inputfile, outputfile, query):
    #print(inputfile, outputfile)
    inputDf = pd.read_csv(inputfile)
    #print(inputDf)
    outputDf = pd.DataFrame()
    print("Will attempt to use function parameters as filenames for ", query, ", working...")

    if (query == "Ipsilateral Impact"): #ipsi impact / pushoff?
        outputDf = goQuery1(inputDf)
    if (query == "Ipsilateral Pushoff"):
        outputDf = goQuery2(inputDf)
    if (query == "Ipsilateral Mostly Impact"):
        outputDf = goQuery3(inputDf)
    if (query == "Just Impact"):
        outputDf = goQuery5(inputDf)
    if (query == "Just Pushoff"):
        outputDf = goQuery6(inputDf)
    if (query == "pdn"):
        #we should also rename this function and the above string. 
        #maybe "PDN + Extra Blocks?"
        outputDf = goPDNQuery(inputDf)
    if (query == "Only PDN"):
        outputDf = queryOnlyPDN(inputDf)

    #print(outputDf)
    outputDf.to_csv(outputfile)
    print("\n\nExported to", outputfile)

    
def exportTable(inputDf, outputfile):
    print("\nExporting to", outputfile)
    #print("input data:", inputDf)
    #print("Will attempt to usse function parameter as inputDf, output filename, working...")
    print(inputDf)
    inputDf.to_csv(outputfile)
    print("\nExported to", outputfile)
    
def goPDNQuery(df1):
    print("\n\nPDN QUERY \n\n")
    df1 = filterTable(df1, "Trial", "==", "Straight Line")
    df1 = filterTable(df1, "Fore Strides", ">", "19")
    dfPDN1 = filterTable(df1, "Blocks", "contains", "PDN")
    # standard in Blocks is "RH: PDN" for example. If there are more than 7 characters
    # in Blocks, that means that there is more than just 1 block. 
    mask = (dfPDN1['Blocks'].str.len() > 7)
    dfPDN1 = dfPDN1.loc[mask]
    dfPDN1 = dfPDN1.loc[:, ['Horse', 'When']]

    # need to slice the date (first 8 characters) out of the 'When' column and keep.
    # TODO: dates are not consistnent string lengths

    df1['When'] = df1['When'].str[:9]
    dfPDN1['When'] = dfPDN1['When'].str[:9]
    dfPDN1 = pd.DataFrame.drop_duplicates(dfPDN1)
    # now dfPDN1 should just be the list of horse names and dates and times. 
    print("About to get all trials for Names on certain Date")
    
    outputDf = pd.DataFrame(columns=df1.columns)
    print("outputDF", outputDf)
    
    # function: give back results from original df1 where the horse names and dates are the same.
    for _, row in dfPDN1.iterrows():
        #print("row.Horse", row.Horse, "row.When", row.When)
        tempDf =  df1.copy()
        
        tempDf = filterTable(tempDf, "Horse", "==", row.Horse)
        tempDf = filterTable(tempDf, "When", "==", row.When)
        #print(tempDf)
        #add row to output DF
        outputDf = outputDf.append(tempDf)
        #print(outputDf)
    return outputDf

def queryOnlyPDN(df1):
    print("\n\nPDN ONLY query \n\n")
    df1 = filterTable(df1, "Trial", "==", "Straight Line")
    df1 = filterTable(df1, "Fore Strides", ">", "19")
    # This filter for when there is only blocks of format "*PDN*" (Where * is wildcard)
    allPDNdf = filterTable(df1, "Blocks", "contains", "PDN")

    # dfPDN1 is the df that will have the list of trials that have more than a PDN block for any trials that day.
    # so, dfPDN1 will be the trials that have more than 7 characters, therefore more than just the PDN block.
    dfPDN1 = allPDNdf.copy()

    mask = (dfPDN1['Blocks'].str.len() > 7)
    dfPDN1 = dfPDN1.loc[mask]
    dfPDN1 = dfPDN1.loc[:, ['Horse', 'When']]

    # need to slice the date (first 8 characters) out of the 'When' column and keep.
    # TODO: dates are not consistnent string lengths
    # 1st) take out first date chars ^^.str[:9] above
    # 2nd) str.contains(date))
    df1['When'] = df1['When'].str[:9]
    dfPDN1['When'] = dfPDN1['When'].str[:9]
    dfPDN1 = pd.DataFrame.drop_duplicates(dfPDN1)
    # now dfPDN1 should just be the list of horse names and dates and times. 
    
    # About to check all trials for Names on certain Date, then add the name of horses to the df
    # if there aren't any other blocks for that horse.
    
    #outputDf = pd.DataFrame(columns=df1.columns)
    #outputDf = allPDNdf.copy()
    #print("allPDNdf", allPDNdf)
    exportTable(allPDNdf, "/home/royal/Desktop/ALLpdn_SAA_JNS.csv")
    # remove horses from output that appear in the dfPDN1['Blocks'].str.len() > 7
    # filter out dfPDN1 

    # function: give back results from original df1 where the horse names and dates are the same 
    # && where that horse had no other blocks on that day.
    
    # function: check the pdn1 
    for _, row in dfPDN1.iterrows():
        filter1 = allPDNdf["Horse"] != row.Horse
        filter2 = allPDNdf["When"] != row.When
        allPDNdf.where(filter1 & filter2, inplace=True)
        #print("filter1", filter1)
        #print("filter2", filter2)
    outputDf = allPDNdf.copy()
    outputDf.dropna(how="all", inplace=True)
    return outputDf   

def goQuery1(df1):
    
    print("\nQUERY 1 ipsilateral impact")
    
    # query 1 ipsilateral impact has 6 parts:
    # 1. straight line trials
    df1 = filterTable(df1, "Trial", "==", "Straight Line")
    # 2. no blocks
    df1 = filterTable(df1, "Blocks", "==", "Null")
    # 3. at least twenty strides (use fore)
    df1 = filterTable(df1, "Fore Strides", ">=", "20")
    # 4. VS > 8.5 (absolute value)
    df1 = filterTable(df1, "Fore Signed Vector Sum", ">", "8.5", absvalue=True)
    # 5. diffMIN pelvis >3 (absolute value)
    df1 = filterTable(df1, "Hind Diff Min Mean", ">", "3", absvalue=True)
    # 6. sign of diffminpelvis same as sign of diffminhead
    df1 = filterTable(df1, "Hind Diff Min Mean", "Same Signs", "Fore Diff Min Mean")

    #print("\n\nQUERY 1 after dropna (finished filtering)\n\n", inputDf
    #print("inputDf is a ", type(inputDf))
    
    return df1

def goQuery2(df1): 
    print("\nQUERY 2 ipsilateral pushoff")
    
    # 1. straight line trials
    df1 = filterTable(df1, "Trial", "==", "Straight Line")
    # 2. no blocks
    df1 = filterTable(df1, "Blocks", "==", "Null")
    # 3. at least twenty strides (use fore)
    df1 = filterTable(df1, "Fore Strides", ">=", "20")
    # 4. VS > 8.5 (absolute value)
    df1 = filterTable(df1, "Fore Signed Vector Sum", ">", "8.5", absvalue=True)
    # 5. diffMAX pelvis >3 (absolute value)
    df1 = filterTable(df1, "Hind Diff Max Mean", ">", "3", absvalue=True)
    # 6. sign of diffmaxpelvis same as sign of diffminhead
    df1 = filterTable(df1, "Hind Diff Max Mean", "Same Signs", "Fore Diff Min Mean")

    return df1  


def goQuery3(df1): 
    print("\nQUERY 3 ipsilateral mostly impact")
    
    # 1. straight line trials
    df1 = filterTable(df1, "Trial", "==", "Straight Line")
    # 2. no blocks
    df1 = filterTable(df1, "Blocks", "==", "Null")
    # 3. at least twenty strides (use fore)
    df1 = filterTable(df1, "Fore Strides", ">=", "20")
    # 4. VS > 8.5 (absolute value)
    df1 = filterTable(df1, "Fore Signed Vector Sum", ">", "8.5", absvalue=True)
    # 5. diffMIN pelvis >3 (absolute value)
    df1 = filterTable(df1, "Hind Diff Min Mean", ">", "3", absvalue=True)
    # 6. diffMAX pelvis >3 (absolute value)
    df1 = filterTable(df1, "Hind Diff Max Mean", ">", "3", absvalue=True)
    # 7. sign of diffminpelvis same as sign of diffmaxpelvis
    df1 = filterTable(df1, "Hind Diff Min Mean", "Same Signs", "Hind Diff Max Mean")
    # 8. sign of diffminpelvis same as sign of diffminhead
    df1 = filterTable(df1, "Hind Diff Min Mean", "Same Signs", "Fore Diff Min Mean")
    # 9. |diffMIN pelvis| > |diffMAX pelvis|
    # df1 = filterTable(df1, "Hind Diff Min Mean", ">", "Hind Diff Max Mean", absvalue=True)

    return df1


def goQuery5(df1):
    print("\nQUERY 5 just impact")

    # straight line trials
    df1 = filterTable(df1, "Trial", "==", "Straight Line")
    # no blocks
    df1 = filterTable(df1, "Blocks", "==", "Null")
    # at least twenty strides (use fore)
    df1 = filterTable(df1, "Fore Strides", ">=", "20")
    # VS < 8.5 (absolute value)
    df1 = filterTable(df1, "Fore Signed Vector Sum", "<", "8.5", absvalue=True)
    # diffMIN pelvis >3 (absolute value)
    df1 = filterTable(df1, "Hind Diff Min Mean", ">", "3", absvalue=True)
    # sign of diffminpelvis same as sign of diffminhead
    df1 = filterTable(df1, "Hind Diff Min Mean", "Same Signs", "Fore Diff Min Mean")
    
    return df1


def goQuery6(df1):
    print("\nQUERY 6 just pushoff")

    # straight line trials
    df1 = filterTable(df1, "Trial", "==", "Straight Line")
    # no blocks
    df1 = filterTable(df1, "Blocks", "==", "Null")
    # at least twenty strides (use fore)
    df1 = filterTable(df1, "Fore Strides", ">=", "20")
    # VS < 8.5 (absolute value)
    df1 = filterTable(df1, "Fore Signed Vector Sum", "<", "8.5", absvalue=True)
    # diffMAX pelvis >3 (absolute value)
    df1 = filterTable(df1, "Hind Diff Max Mean", ">", "3", absvalue=True)
    # sign of diffmaxpelvis same as sign of diffminhead
    df1 = filterTable(df1, "Hind Diff Max Mean", "Same Signs", "Fore Diff Min Mean")
    
    return df1


# def goQuery1_old(inputDf):
    
#     print("\n\nQUERY 1 ipsilateral impact\n\ninputDf", inputDf)


#     # query 1 ipsilateral impact has 6 parts:
#     # 1. straight line trials
#     # 2. no blocks
#     # 3. at least twenty strides
#     # 4. VS > 8.5 (absolute value)
#     # 5. diffMIN pelvis >3 (absolute value)
#     # 6. sign of diffminpelvis same as sign of diffminhead
#     # this is ipsilateral? If memory serves
    
#     # 1. straight lines (can be done in sql but moving to python)
#     straightlineFilter = inputDf["Trial"] == "Straight Line"
    
#     # 2. no blocks
#     inputDf = inputDf[inputDf['Blocks'].isnull()]
    
#     # 3. at least twenty strides 
#     # not sure if this is the correct column. some combo of Fore Strides, Hind Strides?
#     foreStrideFilter = inputDf["Fore Strides"] >= 20
#     hindStrideFilter = inputDf["Hind Strides"] >= 20
    
#     # 4. VS > 8.5 (absolute value). So |vectorsum| > 8.5, or (vectorsum < -8.5 or > 8.5)
#     vectorPosFilter = inputDf["Fore Signed Vector Sum"] > 8.5
#     vectorNegFilter = inputDf["Fore Signed Vector Sum"] < -8.5
    
#     # 5. diffmin pelvis >3 (absolute value)
#     hinddiffminmeanPosFilter = inputDf["Hind Diff Min Mean"] > 3
#     hinddiffminmeanNegFilter = inputDf["Hind Diff Min Mean"] < -3
    
#     # 6. diffminpelvis same sign as diffminhead. 
#     # 'Hind Diff Min Mean' 'Fore Diff Min Mean'
#     samesignFilter = inputDf["Hind Diff Min Mean"] * inputDf["Fore Diff Min Mean"] > 0
    
#     #print("before where\n\n", inputDf)
    
#     #step 1 thru 3 filter
#     inputDf.where(straightlineFilter & foreStrideFilter, inplace=True)
#     #step 4 vector sum filter
#     inputDf.where(vectorPosFilter | vectorNegFilter, inplace=True)
#     #step 5 diffmaxmeanfilter
#     inputDf.where(hinddiffminmeanPosFilter | hinddiffminmeanNegFilter, inplace=True)
#     #step 6 same sign filter
#     inputDf.where(samesignFilter, inplace=True)
    
#     #print("inputDf is a ", type(inputDf))   
#     #print("after where\n\n", inputDf)
#     inputDf.dropna(how="all", inplace=True)
#     #print("\n\nQUERY 1 after dropna (finished filtering)\n\n", inputDf)
    
#     #print("inputDf is a ", type(inputDf))
    
#     return inputDf
    

# def goQuery2_old(inputDf):
    
#     print("\n\nQUERY 2 \n\ninputDf", inputDf)

#     #print("inputDf is a ", type(inputDf))
#     # pandas filtering. 
    
#     # query 2 ipsilateral pushoff has 6 parts:
#     # 1. straight line trials
#     # 2. no blocks
#     # 3. at least twenty strides
#     # 4. VS > 8.5 (absolute value)
#     # 5. diffmax pelvis >3 (absolute value)
#     # 6. sign of diffmaxpelvis same as sign of diffminhead
    
#     # 1. straight lines (can be done in sql but moving to python)
#     straightlineFilter = inputDf["Trial"] == "Straight Line"
    
#     # 2. no blocks
#     inputDf = inputDf[inputDf['Blocks'].isnull()]
    
#     # 3. at least twenty strides 
#     # not sure if this is the correct column. some combo of Fore Strides, Hind Strides?
#     foreStrideFilter = inputDf["Fore Strides"] >= 20
#     hindStrideFilter = inputDf["Hind Strides"] >= 20
    
#     # 4. VS > 8.5 (absolute value). So |vectorsum| > 8.5, or (vectorsum < -8.5 or > 8.5)
#     vectorPosFilter = inputDf["Fore Signed Vector Sum"] > 8.5
#     vectorNegFilter = inputDf["Fore Signed Vector Sum"] < -8.5
    
#     # 5. diffmax pelvis >3 (absolute value)
#     hinddiffmaxmeanPosFilter = inputDf["Hind Diff Max Mean"] > 3
#     hinddiffmaxmeanNegFilter = inputDf["Hind Diff Max Mean"] < -3
    
#     # 6. diffmaxpelvis same sign as diffminhead. 
#     # 'Hind Diff Max Mean' 'Fore Diff Min Mean'
#     samesignFilter = inputDf["Hind Diff Max Mean"] * inputDf["Fore Diff Min Mean"] > 0
    
#     #print("before where\n\n", inputDf)
    
#     #step 1 thru 3 filter
#     inputDf.where(straightlineFilter & foreStrideFilter & hindStrideFilter, inplace=True)
#     #step 4 vector sum filter
#     inputDf.where(vectorPosFilter | vectorNegFilter, inplace=True)
#     #step 5 diffmaxmeanfilter
#     inputDf.where(hinddiffmaxmeanPosFilter | hin = filterTable(tempDf, "Horse", "!=", row.Horse)

#     #step 6 same sign filter
#     inputDf.where(samesignFilter, inplace=True)
    
#     #print("inputDf is a ", type(inputDf))   
#     #print("after where\n\n", inputDf)
#     inputDf.dropna(how="all", inplace=True)
#     print("\n\nQUERY 2 after dropna (finished filtering)\n\n", inputDf)
    
#     #print("inputDf is a ", type(inputDf))
  
#     return inputDf

def nullBlocks(inputDf):
    
    #print("\n\nNullBlocks activated on: \n\ninputDf", inputDf)

    #print("inputDf is a ", type(inputDf))
    # pandas filtering. 

    # 2. no blocks
    inputDf = inputDf[inputDf['Blocks'].isnull()]
    
    #print("inputDf is a ", type(inputDf))   
    #print("after where\n\n", inputDf)
    inputDf.dropna(how="all", inplace=True)
    #print("\n\nDropna in NullBlocks (finished filtering)\n\n", inputDf)
    
    #print("inputDf is a ", type(inputDf))
  
    return inputDf

def filterTable(df, column, operator, value, absvalue="None"):
    # print("\nfiltering", column, operator, value)
    #the conditional operators: (>, <, >=, <=, ==, !=)
    #also, for absolute value there will be more
    if (value == "Null" and column == "Blocks" and operator == "=="):
        df = nullBlocks(df)
        return df
        # print(df[column])
    elif (operator == "contains"):
        contain_values = df[df[column].str.contains(value, na=False, regex=False)]
        # print(contain_values)
        df.dropna(how="all", inplace=True)
        return contain_values
    if (operator == "Same Signs"):
        tableFilter = df[column] * df[value] > 0
        df.where(tableFilter, inplace=True)
        df.dropna(how="all", inplace=True)
        return df
    if (operator == "Opposite Signs"):
        tableFilter = df[column] * df[value] < 0
        df.where(tableFilter, inplace=True)
        df.dropna(how="all", inplace=True)
        return df
    else:
        # print("Is str 1", isinstance(value, str))
        if(is_number(value) & isinstance(value, str)):
            value = float(value)
            # print("\/Is str 2", isinstance(value, str))
        #if (left and right abs are true)
        ##pandas dataframe function perhaps:
            # can we get the aboslute value of the column in order to make the filter?
            # df1[column].abs()?  
        
        if (absvalue == "Right"):   
            # TODO: make sure the value is positive otherwise the math is wrong
            # TODO: allow for two strings comparison 
            # 9. |diffMIN pelvis| > |diffMAX pelvis|
            # df1 = filterTable(df1, "Hind Diff Min Mean", ">", "Hind Diff Max Mean", absvalue=True)
            if (operator == "=="):
                tableFilter = df[column] == value
                tableFilter2 = df[column] == -1*value
                df.where(tableFilter | tableFilter2, inplace=True)
            elif (operator == ">"):
                tableFilter = df[column] > value
                tableFilter2 = df[column] < -1*value
                df.where(tableFilter | tableFilter2, inplace=True)
            elif (operator == "<"):
                tableFilter = df[column] < value
                tableFilter2 = df[column] > -1*value
                df.where(tableFilter & tableFilter2, inplace=True)
            elif (operator == ">="):
                tableFilter = df[column] >= value
                tableFilter2 = df[column] <= -1*value
                df.where(tableFilter | tableFilter2, inplace=True)
            elif (operator == "<="):
                tableFilter = df[column] <= value
                tableFilter2 = df[column] >= -1*value
                df.where(tableFilter & tableFilter2, inplace=True)
            elif (operator == "!="):
                tableFilter = df[column] != value
                tableFilter = df[column] != -1*value
                df.where(tableFilter & tableFilter2, inplace=True)
            else:
                errorstring = "\n\nINPUT::\nOperator not valid and will cause tableFilter reference before assignment"
                raise ValueError(errorstring)   
                
        else:    #abs is none
            if (operator == "=="):
                tableFilter = df[column] == value
            elif (operator == ">"):
                tableFilter = df[column] > value
            elif (operator == "<"):
                tableFilter = df[column] < value
            elif (operator == ">="):
                tableFilter = df[column] >= value
            elif (operator == "<="):
                tableFilter = df[column] <= value
            elif (operator == "!="):
                tableFilter = df[column] != value
            else:
                errorstring = "\n\nINPUT::\nOperator not valid and will cause tableFilter reference before assignment"
                raise ValueError(errorstring)      
            df.where(tableFilter, inplace=True)
            
    df.dropna(how="all", inplace=True)
    
    return df


# def main():
#     print("printed from main")
#     #create parser
#     parser = argparse.ArgumentParser()
    
#     #add arguments to the parser
#     parser.add_argument("inputfile")
#     parser.add_argument("outputfile")
    
#     args = parser.parse_args()
    
#     inputDf = pd.read_csv(args.inputfile)
#     #print(inputDf)
#     outputDf = pd.DataFrame()
    
#     #ANALYSIS MEASUREMENT: vectorSum (type1), diffMinHead (diffMinMean type1), diffMinPelvis (diffMinMean type2), diffMaxMean (type2), diffMinStdDev (type2),
#     #TRIALhorseID, idGuid, trialPattern, id, 
#     #HORSE id (horse), name (name), idGuid, 
#     #OWNER id, firstName, lastName, idGuid, 
#     #PERSON id, lastName, idGuid
    
#     print("Will attempt to use arguments as filenames, working...")
#     outputDf = goQuery(inputDf, outputDf)
 
#     outputDf.to_csv(args.outputfile)
#     print("Exported to", args.outputfile)
 
# if __name__ == "__main__":
#     main()
