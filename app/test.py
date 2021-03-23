# -*- coding: utf-8 -*-
import horseFiltering as fdb
import pandas as pd
import csv

def main():
    #mtable.nonCLI("/home/royal/Desktop/inputabsol.csv", "/home/royal/Desktop/outputheadless.csv")


    # df1 = fdb.createTable("/home/royal/Documents/IndependentProjects/Horse/Spreadsheet SAA tablet 060121.csv")
    # df1 = fdb.appendCSV(df1, "/home/royal/Documents/IndependentProjects/Horse/Spreadsheet JNS tablet 100121.csv")
    df1 = fdb.createTable("/home/royal/Desktop/LLocator-Results-2021-01-11.csv")
    # fdb.exportTable(df1, "/home/royal/Desktop/inputpdn_SAA_JNS.csv")

    # df1 = fdb.createTable("/home/royal/Desktop/inputpdn_SAA_JNS.csv")
    # fixSAAJNSpycsv()
    # fixSAAJNSpandas()

    #df2 = df1.copy()
    #df2 = fdb.goPDNQuery(df2)
    #fdb.exportTable(df2, "/home/royal/Desktop/MORETHAN1pdn_SAA_JNS.csv")

    # df1 = fdb.queryOnlyPDN(df1)
    df1 = fdb.queryOnlyPDN(df1)


    fdb.exportTable(df1, "/home/royal/Desktop/outputONLYpdn.csv")
    return

def fixSAAJNSpandas():
    # I'm going to try a similar method with Pandas. When I try it with Pandas, I will 
    # make it check per row if the name field starts with a quote (it shouldn't) 
    # and if the final field ends with a quote (it should just be default, not default")

    df1 = fdb.createTable("/home/royal/Documents/IndependentProjects/Horse/Spreadsheet SAA tablet 060121.csv")
    for _, row in df1.iterrows():
        if (pd.isna(row.Horse)):
            print(row)
    return

def fixSAAJNSpycsv():
    with open("/home/royal/Documents/IndependentProjects/Horse/Spreadsheet SAA tablet 060121.csv", 'rt') as f:
        data = f.read()

    #data = data.replace('default""', 'default')
    # data = data.replace('"', '')
    # data = data.replace(',""', ',"')
    # data = data.replace('"",', '",')

    print("read file")

    with open("/home/royal/Desktop/SAAnoquote.csv", mode='w') as f:
        f_writer = csv.writer(f, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        for row in csv.reader(data.splitlines(), delimiter=',', skipinitialspace=True):
            # try:
            #     if row[1] is not None:
            #         print(row[1], type(row[1]))
            #         # f_writer.writerow(row)
            # except:
            #     print(row[0], type(row[0]))
            try:
                if row[1] is not None:
                    # pass
                    print(type(row))
                    # f_writer.writerow(row)
            except:
                print(row[0], type(row[0]))
                print(type(row))
            f_writer.writerow(row)
    print("wrote file")
    return




# query 2
# 1. straight line trials
# 2. no blocks
# 3. at least twenty strides
# 4. VS > 8.5 (absolute value)
# 5. diffmax pelvis >3 (absolute value)
# 6. sign of diffmaxpelvis same as sign of diffminhead

"""
# query 1 ipsilateral impact has 6 parts:
# 1. straight line trials
df1 = fdb.filterTable(df1, "Trial", "==", "Straight Line")
# 2. no blocks
df1 = fdb.filterTable(df1, "Blocks", "==", "Null")
# 3. at least twenty strides
df1 = fdb.filterTable(df1, "Fore Strides", ">=", "20")
# 4. VS > 8.5 (absolute value)
df1 = fdb.filterTable(df1, "Fore Signed Vector Sum", ">", "8.5", absvalue=True)
# 5. diffMIN pelvis >3 (absolute value)
df1 = fdb.filterTable(df1, "Hind Diff Min Mean", ">", "3", absvalue=True)
# 6. sign of diffminpelvis same as sign of diffminhead
df1 = fdb.filterTable(df1, "Hind Diff Min Mean", "Same Signs", "Fore Diff Min Mean")
"""
# df1 = fdb.queryOnlyPDN(df1)

# fdb.exportTable(df1, "/home/royal/Desktop/outputONLYpdn_SAA_JNS.csv")

# fdb.nonCLI("/home/royal/Desktop/output/LLocator-Results-2021-01-11.csv", "/home/royal/Desktop/output/query1output.csv", "query1")
# fdb.nonCLI("/home/royal/Desktop/output/LLocator-Results-2021-01-11.csv", "/home/royal/Desktop/query2output.csv", "query2")

"""


#dbtestframe = mtable.createTable("/home/royal/Desktop/LLocator-Results-2020-11-08.csv")
#print("dbtestframe LLocator on desktop", dbtestframe)

#outputDf = pd.DataFrame()

mtable.nonCLI2("/home/royal/Desktop/LLocator-Results-2020-11-08.csv", "/home/royal/Desktop/query2output333.csv")
mtable.nonCLI1("/home/royal/Desktop/LLocator-Results-2020-11-08.csv", "/home/royal/Desktop/query1outputtest.csv")
#outputDf = mtable.goQuery1(dbtestframe, outputDf)

#print("output!", outputDf)
"""

"""
can this be a csv or file / file location / data itself as the parameter and not the string itself?
upload file to the form, have the file as a variable or something in the form, read it in directly,
the function takes the file itself (or its data) same way. WHen done, it would return the file / data
back to where the nonCLI function was called and then the function user could format it or do what they 
need with it.

- take filename in function
- perform actions
- outputs to given filename


YOu can use the nonCLI function above (essentially a read_csv wrapper) with any absolute filepath and filename, I think.
If no filepath is given, working directory is assumed. This would be useful for orginzation / security.

"""
#/home/royal/Desktop/inputabsol.csv

if __name__ == "__main__":
    main()