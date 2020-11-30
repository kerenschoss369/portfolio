'use strict';

$(document).ready(function() {
    initPage();
})

function initPage() {
    renderProjects();
}

function onClickProject(ev, id) {
    ev.preventDefault();
    var project = getProjectById(id);
    $('.project-name-modal').text(project.name);
    $('.project-title-modal').text(project.title);
    $('.project-url-modal').attr('src', project.imgUrl);
    $('.project-desc-modal').text(project.desc);
    $('.project-published-at-modal').text(`Date: ${project.publishedAt}`);
    $('.project-labels-modal').text(`Labales: ${project.labels}`);
    $('.watch-project-btn').click(() => onShowProject(ev, project.id));
}

function onShowProject(ev, id) {
    window.open(`projects/${id}`, '_blank');
}

function onSubmit(ev) {
    ev.preventDefault();
    var subject = $('.title-input').val();
    var body = $('.body-input').val();
    console.log(`sub: ${subject} body: ${body}`)
    window.open(`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=kerenschoss369@gmail.com&su=${subject}&body=${body}&bcc=kerenschoss369@gmail.com&tf=1`);
}

function renderProjects() {
    const projects = getProjects();

    const strHTMLs = projects.map(getProjectHTML);

    $('.projects-container').html(strHTMLs.join(''));

}

function getProjectHTML(project) {
    const { id, name, imgUrl, title } = project;
    return `<div class="col-md-4 col-sm-6 portfolio-item">
    <a class="portfolio-link" data-toggle="modal" onclick="onClickProject(event,'${id}')" href="#portfolioModal">
        <div class="portfolio-hover">
            <div class="portfolio-hover-content">
                <i class="fa fa-plus fa-3x"></i>
            </div>
        </div>
        <img class="img-fluid" src="${imgUrl}" alt="">
    </a>
    <div class="portfolio-caption">
        <h4>${name}</h4>
        <p class="text-muted">${title}</p>
    </div>
</div>`;
}