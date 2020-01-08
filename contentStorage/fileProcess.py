import json
processedFile = open("contentStorage/finalList.txt", "w+")

def alnumIndex(line):
    for index in range(len(line)):
        if line[index].isalnum():
            return index
    return 0

dataList = list()
with open("contentStorage/blacklist.txt") as dataFile:
    for line in dataFile:
        nonAlLen = alnumIndex(line)
        endLen = nonAlLen + 6
        dataToWrite = line[1:]
        if dataToWrite[-1] == "*":
            dataToWrite = dataToWrite[:-1]
        processedFile.write(dataToWrite)
        dataList.append(dataToWrite)
dataList = list(set(dataList))
print(json.dumps(dataList), ";", sep = "")
processedFile.close()

