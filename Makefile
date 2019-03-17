SOURCES = src/index.html src/visualization.js src/css/ src/datasets/IllinoisStudentsByCurriculum.csv

.PHONY: all
all: $(SOURCES)
	python3 -m http.server --directory src/