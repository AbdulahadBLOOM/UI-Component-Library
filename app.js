/**
 * ComponentKit — scripts.js
 * jQuery + Bootstrap 5 interactions
 */

$(function () {

  /* ─── Bootstrap Tooltips ─── */
  const tooltipEls = $('[data-bs-toggle="tooltip"]').toArray();
  tooltipEls.forEach(el => new bootstrap.Tooltip(el));

  /* ─── Bootstrap Popovers ─── */
  const popoverEls = $('[data-bs-toggle="popover"]').toArray();
  popoverEls.forEach(el => new bootstrap.Popover(el));

  /* ─── Sidebar active link on scroll ─── */
  const sections = $('section[id]');
  const navLinks  = $('.sidebar-nav .nav-link');

  $(window).on('scroll', function () {
    let current = '';
    sections.each(function () {
      if ($(window).scrollTop() >= $(this).offset().top - 120) {
        current = $(this).attr('id');
      }
    });
    navLinks.removeClass('active');
    navLinks.filter(`[href="#${current}"]`).addClass('active');
  });

  navLinks.on('click', function () {
    navLinks.removeClass('active');
    $(this).addClass('active');
  });

  /* ─── Password Toggle ─── */
  $('#togglePw').on('click', function () {
    const input = $('#pwField');
    const isPass = input.attr('type') === 'password';
    input.attr('type', isPass ? 'text' : 'password');
    $(this).html(isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>');
  });

  /* ─── Range Slider ─── */
  $('#ratingSlider').on('input', function () {
    $('#sliderVal').text($(this).val());
  });

  /* ─── Form Submit ─── */
  $('#submitForm').on('click', function () {
    showToast('success', 'Form submitted successfully!');
  });

  /* ─── Loading Button ─── */
  $('#resetLoadBtn').on('click', function () {
    const $btn = $('#loadBtn');
    $btn.removeClass('disabled').html('<span class="spinner-border spinner-border-sm me-2" role="status"></span>Processing…');
    setTimeout(function () {
      $btn.addClass('disabled').html('<i class="bi bi-check2 me-2"></i>Done!');
      showToast('success', 'Process completed!');
    }, 2200);
  });

  /* ─── Toast System ─── */
  function showToast(type, message) {
    const icons = {
      success : 'bi-check-circle-fill',
      danger  : 'bi-x-circle-fill',
      warning : 'bi-exclamation-triangle-fill',
      info    : 'bi-info-circle-fill'
    };
    const labels = { success: 'Success', danger: 'Error', warning: 'Warning', info: 'Info' };
    const colors  = { success: '#2a9d8f', danger: '#e63946', warning: '#e9c46a', info: '#4361ee' };

    const id = 'toast-' + Date.now();
    const html = `
      <div id="${id}" class="toast align-items-center border-0 shadow" role="alert" data-bs-autohide="true" data-bs-delay="3500">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi ${icons[type]}" style="color:${colors[type]};font-size:1.1rem"></i>
            <span><strong>${labels[type]}:</strong> ${message}</span>
          </div>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>`;

    $('#toastContainer').append(html);
    const el = document.getElementById(id);
    new bootstrap.Toast(el).show();
    $(el).on('hidden.bs.toast', function () { $(this).remove(); });
  }

  $('#toastSuccess').on('click', () => showToast('success', 'Record saved successfully.'));
  $('#toastError')  .on('click', () => showToast('danger',  'Failed to connect to server.'));
  $('#toastWarning').on('click', () => showToast('warning', 'Your session will expire soon.'));
  $('#toastInfo')   .on('click', () => showToast('info',    'New updates are available.'));

  /* ─── Progress Animate on scroll into view ─── */
  function animateProgressBar() {
    const $bar = $('#animBar');
    if (!$bar.length) return;
    const top = $bar.offset().top;
    if ($(window).scrollTop() + $(window).height() > top) {
      if ($bar.css('width') === '0px') {
        $bar.css('width', '63%');
      }
      $(window).off('scroll.progress');
    }
  }
  $(window).on('scroll.progress', animateProgressBar);
  animateProgressBar();

  /* ─── Table: Search ─── */
  $('#tableSearch').on('input', function () {
    const q = $(this).val().toLowerCase();
    $('#tableBody tr').each(function () {
      const text = $(this).text().toLowerCase();
      $(this).toggle(text.includes(q));
    });
  });

  /* ─── Table: Select All ─── */
  $('#selectAll').on('change', function () {
    $('#tableBody input[type="checkbox"]').prop('checked', $(this).is(':checked'));
  });

  /* ─── Table: Sortable Headers ─── */
  let sortDir = {};
  $('.sortable').on('click', function () {
    const col = $(this).data('col');
    sortDir[col] = !sortDir[col];
    const $rows = $('#tableBody tr').toArray();

    $rows.sort(function (a, b) {
      const aVal = $(a).find('td').eq(col + 1).text().trim().toLowerCase();
      const bVal = $(b).find('td').eq(col + 1).text().trim().toLowerCase();
      return sortDir[col]
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    $('#tableBody').empty().append($rows);
    $('.sortable i').attr('class', 'bi bi-chevron-expand');
    $(this).find('i').attr('class', sortDir[col] ? 'bi bi-chevron-up' : 'bi bi-chevron-down');
  });

  /* ─── Table: Delete row ─── */
  $(document).on('click', '#dataTable .btn-outline-danger', function () {
    const $row = $(this).closest('tr');
    const name = $row.find('td').eq(1).text();
    $row.addClass('table-danger').fadeOut(400, function () {
      $(this).remove();
      showToast('danger', `"${name}" has been removed.`);
    });
  });

  /* ─── Table: Edit row ─── */
  $(document).on('click', '#dataTable .btn-outline-primary', function () {
    const name = $(this).closest('tr').find('td').eq(1).text();
    showToast('info', `Editing "${name}" — feature coming soon.`);
  });

});