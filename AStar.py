def AStar(_adjacencyMatrix, _distanceMatrix, _start, _end) :
# mencari jalan terdekat dari dua buah titik menggunakan fungsi A*
# mengembalikan list of path
	listOfPath = [_start]
	closestInAdj = []
	next = _start		# ini adalah nama simpul
	prev = _start		# supaya tidak backtraking
	distanceSaved = 0	# ini adalah jarak yang telah ditempuh
	closestInAdj.append(_start)			# inisialisasi
	closestInAdj.append(distanceSaved)		# inisialisasi
	
	while (next != _end) :
		closestInAdj = subAStar(_adjacencyMatrix, _distanceMatrix, next, prev, _end, distanceSaved)
		prev = next
		next = closestInAdj[0]
		distanceSaved = closestInAdj[1]		
		listOfPath.append(next)	
	return listOfPath
	

def subAStar(_adjacencyMatrix, _distanceMatrix, current, prev, _end, distanceSaved) :
# mencari f(n) dengan nilai paling kecil dari seluruh simpul yang bertetangga dengannya
# mengembalikan titik berupa integer
	closest = []
	closest.append(current) 															# inisialisasi simpul dengan jarak terdekat. Berupa matriks
	closest.append(getLongestDistance(current, _end, _distanceMatrix, distanceSaved))	# indeks pertama (0) adalah nama simpulnya dan indeks kedua (1) adalah jarak terjauh
	
	for i in range(len(_adjacencyMatrix[current])) :
		if (i != prev and _adjacencyMatrix[current][i] != 0) :
			if (getFn(current, i, _end, distanceSaved, _distanceMatrix) < closest[1]) :
				closest[0] = i 
				closest[1] = getFn(current, i, _end, distanceSaved, _distanceMatrix)
			elif (getFn(current, i, _end, distanceSaved, _distanceMatrix) == closest[1]) :
				if (i == _end) :
					closest[0] = i 
					closest[1] = getFn(current, i, _end, distanceSaved, _distanceMatrix)
	closest[1] = getGn(current, i, distanceSaved, _distanceMatrix)
	return closest



def getLongestDistance (current, _end, _distanceMatrix, distanceSaved) :
# mencari f(n) dengan nilai terbesar, yaitu gabungan dari g(n) terbesar dan h(n) terbesar
	longestDistance = 0
	longestHn = 0
	for i in range(len(_distanceMatrix[current])) :
		if (_distanceMatrix[current][i] > longestDistance) :	# mencari jarak antar simpul dengan nilai terbesar
			longestDistance = _distanceMatrix[current][i]
		if (getHn(i, _end, _distanceMatrix) > longestHn) :
			longestHn = getHn(i, _end, _distanceMatrix)			# mencari h(n) dengan nilai terbesar
	return (longestDistance + distanceSaved + longestHn)

def getFn(current, next, _end, distanceSaved, _distanceMatrix) :
	return getGn(current, next, distanceSaved, _distanceMatrix) + getHn(next, _end, _distanceMatrix)

def getGn(current, next, distanceSaved, _distanceMatrix) :
# g(n) adalah jarak suatu titik ke titik berikutnya (tetangganya) ditambah jarak yang telah dilalui dari awal
	return (_distanceMatrix[current][next] + distanceSaved)
	
def getHn(current, next, _distanceMatrix) :
# h(n) adalah jarak heuristik. dapat diambil dengan cara melihat ke _distanceMatrix
	return _distanceMatrix[current][next]
