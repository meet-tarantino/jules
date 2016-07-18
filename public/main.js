function loadMovies() {
  $.get('/api/movies', (movies) => {
    const html = movies.map((movie) => {
      return`<div class="list-group-item">
                <h4 class="list-group-item-heading"><strong>${movie.title}</strong></h4>
                <p class="list-group-item-text">${movie.description}</p>
             </div>`
    });
    $('.movie-list').html(html.join(''));
  });
}

function saveMovie(movie) {
  $.ajax({ type: 'POST', url: '/api/add-movie', data: movie, success: loadMovies });
}

$('.save-movie').click((evt) => {
  evt.preventDefault();
  const movie = {
    title: $('#movieTitle').val(),
    description: $('#movieDescription').val()
  };
  saveMovie(movie);
});

$(document).ready(loadMovies);