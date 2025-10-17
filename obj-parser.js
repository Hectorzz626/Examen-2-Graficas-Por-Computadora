/**
 * Analiza el contenido de un archivo .obj y extrae la geometría.
 * @param {string} text - El contenido completo del archivo .obj como texto.
 * @returns {{
 * positions: Float32Array, 
 * normals: Float32Array, 
 * triangles: Array<{vertices: Array<[number,number,number]>, normals: Array<[number,number,number]>}>
 * }}
 */
function parseOBJ(text) {
    const temp_positions = [];
    const temp_normals = [];

    // Arreglos para el renderizado final del objeto
    const final_positions = [];
    const final_normals = [];
    
    // Arreglo para guardar la estructura de los triángulos
    const triangles = [];

    const lines = text.split('\n');
    for (const line of lines) {
        const parts = line.trim().split(' ');
        const prefix = parts.shift();

        if (prefix === 'v') {
            temp_positions.push(parts.map(parseFloat));
        } else if (prefix === 'vn') {
            temp_normals.push(parts.map(parseFloat));
        } else if (prefix === 'f') {
            // Itera sobre los vértices de la cara para formar triángulos
            for (let i = 0; i < parts.length - 2; ++i) {
                const indices = [parts[0], parts[i + 1], parts[i + 2]];
                
                const currentTriangle = {
                    vertices: [],
                    normals: []
                };

                for (const indexString of indices) {
                    const faceParts = indexString.split('/');
                    const posIndex = parseInt(faceParts[0]) - 1;
                    const normalIndex = parseInt(faceParts[2]) - 1;

                    if (temp_positions[posIndex] && temp_normals[normalIndex]) {
                        // Añadir a los arreglos de renderizado
                        final_positions.push(...temp_positions[posIndex]);
                        final_normals.push(...temp_normals[normalIndex]);
                        
                        // Añadir a la estructura del triángulo actual
                        currentTriangle.vertices.push(temp_positions[posIndex]);
                        currentTriangle.normals.push(temp_normals[normalIndex]);
                    }
                }
                
                // Guardar el triángulo completo
                triangles.push(currentTriangle);
            }
        }
    }

    return {
        positions: new Float32Array(final_positions),
        normals: new Float32Array(final_normals),
        triangles: triangles
    };
}