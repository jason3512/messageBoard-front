const APIUrl =  'http://127.0.0.1:8000/api/messages';

$(document).ready(() => {
  const commentsDOM = $('.comments');
  getComments(commentsDOM);

  $('.add-comment-form').submit((e) => {
    e.preventDefault();
    addComment(commentsDOM);
  });
});

$(document).on('click', '.btn-edit' ,function() {
    var element = $(this);
    var id = element.attr('data-id');
    const member = $('input[name=member]').val();
    const message = $('textarea[name=content]').val();
    const newComment = {
        member,
        message
    };
    $.ajax({
        type: 'PUT',
        url: `${APIUrl}/`+id,
        data: newComment,
        success: function(response) {
            alert('修改成功');
            location.reload();
        }
      })
});
$(document).on('click', '.btn-update' ,function() {
    var element = $(this);
    var id = element.attr('data-id');
    $.ajax({
        type: 'GET',
        url: `${APIUrl}/`+id,
        success: function(response) {
          $('.container').remove();  
          editcomment(response);
        }
      })
});
$(document).on('click', '.btn-delete' ,function() {
    var element = $(this);
    var id = element.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: `${APIUrl}/`+id,
      success: function(response) {
        $('#card'+id).remove();
      }
    })
  });
function getCommentsAPI(cb) {
    let url = `${APIUrl}`;
    $.ajax({ url })
      .done(data => cb(data))
      .fail(err => console.log(err));
}
function getComments(commentsDOM) {
    getCommentsAPI((data) => {
        if (!data.ok) {
        return;
        }

        const comment = data.messages;
        for (let i = 0; i < comment.length; i += 1) {
            appendCommentToDOM(commentsDOM, comment[i]);
        }
    });
}
function appendCommentToDOM(container, comment) {
    const html = `
        <div class="card m-2" id="card${comment.id}">
        <div class="card-body">
            <div class="card-top d-flex">
            <h5 class="card-title"><i class="fa fa-user" aria-hidden="true">Member : </i>&nbsp;&nbsp;${(comment.member)}</h5>
            </div>
            <p class="card-text content">${(comment.message)}</p>
            <input hidden value="${comment.id}"/>
        </div>
        <div>
            <button type="submit" class="btn btn-update" data-id= "${comment.id}">修改</button>
            <button type="submit" class="btn btn-delete" data-id= "${comment.id}">刪除</button>
        </div>
        </div>`;
    container.append(html);
}
function addComment(commentsDOM) {
    const member = $('input[name=member]').val();
    const message = $('textarea[name=content]').val();
    const remindMsg = '<div class="alert alert-danger mt-5" role="alert">Please complete both nickname and content!</div>';
    if (member === '' || message === '') {
        if(member === '' ){
            alert('請填入member');  
        }
        if(message === '' ){
            alert('請填入message');  
        }
        return;
    }
  
    const newComment = {
      member,
      message,
    };
    $.ajax({
      type: 'POST',
      url: `${APIUrl}`,
      data: newComment,
    })
    .done((data) => {
        newComment.created_at = data.created_at;
        appendCommentToDOM(commentsDOM, newComment, true);
        $('.form-control').val('');
        $('.alert').remove();
        alert('新增成功');
    })
      .fail(err => console.log(err));
  }
  function editcomment(data) {
    const html = `  <div class="container">
                        <form class="edit-comment-form mt-4 mb-4">
                        <div class="form-group">
                            <label for="member">member</label>
                            <input class="form-control" name="member" aria-describedby="emailHelp" value="${data.member}" >
                        </div>
                        <div class="form-group">
                            <label for="content-textarea">Please leave your message here</label>
                            <textarea name="content" class="form-control" aria-label="With textarea" >${data.message}</textarea>
                        </div>
                        <button type="button" class="btn btn-edit" data-id= "${data.id}">Submit</button>
                        <div class="comments"></div>
                        </form>
                    </div>`
    $('body').append(html);
  }
