'use strict';

var gProjects = _createProjects();

function getProjects() {
    return gProjects;
}

function getProjectById(id) {
    return gProjects.find(project => project.id === id)
}

function _createProjects() {
    var projects = []
    projects.push(_createProject('1', 'Books Shop', 'Be a Book Shop Manager', 'asdasdasdasd', 'img/portfolio/bookShop.jpg', '10/11/2020', ["Matrixes", "keyboard events"]));
    projects.push(_createProject('2', 'Mine Sweeper', 'Probably The Most Nostagic Game', 'asdasdasdasd', 'img/portfolio/mineSweeper.png', '03/11/2020', ["Matrixes", "keyboard events"]));
    projects.push(_createProject('3', 'Touch The Numbers', 'For Your Boring Kids', 'asdasdasdasd', 'img/portfolio/touchTheNums.png', '04/11/2020', ["Matrixes", "keyboard events"]));
    return projects;
}

function _createProject(id, name, title, desc, imgUrl, publishedAt, labels) {
    var project = {
        id,
        name,
        title,
        desc,
        imgUrl,
        publishedAt,
        labels,
    }
    return project;
}