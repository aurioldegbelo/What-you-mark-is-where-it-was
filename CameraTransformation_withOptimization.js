ImageCoordsList = .. // Given X image coordinations of ..
WorldCoordsList = .. // corresponding world coordinations
Image = .. // source photo

// Estimates the camera position (x, z) with the smallest deviation
// between calculated and given image X coordinates from given world coordinations.
// Uses a virtual camera object with the transformation attributes 'position' and 'rotation
// @return best position
Vector3 function FindCameraTransformation() {

	bestPosition = null
	lowestDeviation = integerMax

	List<KeyValuePair<float, position>> consideredPositions = null // Saves all considered positions and search at the best again
	searchRange = 100 // range size of iterating
	stepSize = 10 // size of steps during iteration
	
	for(x = startpositionX - searchRange / 2; x < startpositionX + searchRange / 2; x = x + stepSize) 
		for(z = startpositionZ - searchRange / 2; z < startpositionZ + searchRange / 2; z = z + stepSize) 
			AnalyzePosition(x, z)

	
	
	for(c = 0; c < 5; c++) // Optimization: How often stepSize will be lowered
		stepSize = stepSize / 4
		
		Delete90HighestDeviations(consideredPositions) // Sort list and remove the 90 percent with the highest deviation
		
		
		for(i = 0; i < consideredPositions.Count; i = i + 1 // Iterating through best positions left
			curPosition = consideredPositions[c].Value;
			curDelta = stepSize * 2;
			for(x = curPosition.x - curDelta; x <  curPosition.x + curDelta; x = x + stepSize) 
				for(z = curPosition.z - curDelta; z < curPosition.z + curDelta; z = z + stepSize) 
					
					AnalyzePosition(x, z)
					
	
	Delete90HighestDeviations(consideredPositions)
	
	return consideredPositions[0].value // First entry is the one with lowest deviation
}


// Calculates the deviation for a given position
void function AnalyzePosition(x, z, consideredPositions) {
	position = new Vector3(x,0,z);

	if(BetweenOuterLines(position)) // Optimization: Only positions between the two outer lines gets checked 
		SetCameraPosition(position)
		deviation = GetLowestPxlDeviation(stepSize)
	else
		deviation=integerMax
		
	consideredPositions.Add(new KeyValuePair(deviation, position))
}


// Rotates the camera step by step (number of details defined by stepSize)
// @return the lowest deviation value from all observed rotations 
float function GetLowestPxlDeviation(stepSize) {

	lowestDeviation = integerMax
	deviationBefore = 0
	for(r = 0; r < 360; r = r + stepSize) 
		SetCameraXRotation(r)
		deviation = CalcDeviation()
		if(deviation < lowestDeviation)
			lowestDeviation = deviation;
		
		
		// Optimization: Skip steps of rotations
		if(deviationBefore<deviation) stepSize+=.5;
		if(deviationBefore>deviation) stepSize-=.5;
		stepSize=Clamp(stepSize,1,5)
		deviationBefore=deviation;
		
		return deviation
		
}

// Calculate the deviation between all given coordinats and the calculated ones from set camera transformation
// @return average deviation 
float function CalcDeviation() {
	sum = 0
	
	for(i=0; i < WorldCoordsList.Count; i++) 
		error = Abs( CalcPixelPosition(WorldCoordsList[i]) - ImageCoordsList[i] )
		sum = sum + error
		
		
	sum = sum / WorldCoordsList.Count
}

// Get the projected image coordinate of a given world position from set camera transformation
// i) Set the given world position to relative coordinates to the camera transformation
// ii) Then 'draw' a line between the both outer view angles at relative world position z
// iii) convert the relative position of the point on this line to pixels with Image.width
// @return image x coordinate for given worldPosition 
float function CalcPixelPosition(worldPosition) {
	..
	

}
