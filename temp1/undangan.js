$(document).ready(function () {

    const path = window.location.pathname;
    const pathElements = path.split('/');

    const totalElements = pathElements.length;
    const code = pathElements[totalElements - 2];
    const slug = pathElements[totalElements - 1];

    var meta = $('meta#url')
    var base_url = meta.attr('base_url')
    var backand_url = meta.attr('backand_url')

    function ubahFormatTanggal(tanggalString) {
        var namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

        var namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus",
            "September", "Oktober", "November", "Desember"
        ];
        var tanggalAwal = new Date(tanggalString);
        var namaHariIndonesia = namaHari[tanggalAwal.getDay()];

        var tanggal = tanggalAwal.getDate();
        var namaBulanIndonesia = namaBulan[tanggalAwal.getMonth()];

        var tahun = tanggalAwal.getFullYear();
        var hasil = namaHariIndonesia + ', ' + tanggal + ' ' + namaBulanIndonesia + ' ' + tahun;

        return hasil;
    }


    function fetch_meta(response) {
        let undangan = response.undangan
        let pengantin = undangan.pengantin
        let pengantin_laki_laki = ''
        let pengantin_perempuan = ''
        $(pengantin).each(function (index, pengantin) {
            if (pengantin.jenis_kelamin == 'laki_laki') {
                pengantin_laki_laki = pengantin.nama_panggilan
            } else {
                pengantin_perempuan = pengantin.nama_panggilan
            }
        });
        $('.page_title').text(pengantin_laki_laki + ' & ' + pengantin_perempuan)
        $('#favicon').attr('href', undangan.foto_sampul)
    }

    function fetch_hero(response) {
        let undangan = response.undangan
        let pengantin = undangan.pengantin
        let acara = undangan.acara

        //swiper
        let swiper_base = $('#swiper_base')
        if (undangan.gallery.length > 1) {
            $.each(undangan.gallery, function (index, value) {
                let swiper_content = `
            <div class="swiper-slide">
                    <div class="slide-inner slide-bg-image" data-background="${value.foto}">
                    </div> <!-- end slide-inner -->
                </div> 
            `
                swiper_base.append(swiper_content)
                $(".slide-bg-image").each(function (indx) {
                    if ($(this).attr("data-background")) {
                        $(this).css("background-image", "url(" + $(this).data(
                            "background") + ")");
                    }
                });
            })
        } else {
            let swiper_content = `
            <div class="swiper-slide">
                    <div class="slide-inner slide-bg-image" data-background="${undangan.foto_sampul}">
                    </div> <!-- end slide-inner -->
                </div> 
            `
            swiper_base.append(swiper_content)
            $(".slide-bg-image").each(function (indx) {
                if ($(this).attr("data-background")) {
                    $(this).css("background-image", "url(" + $(this).data(
                        "background") + ")");
                }
            });
        }
        //end swiper

        //nama pengantin
        $(pengantin).each(function (index, pengantin) {
            $('.nama_panggilan_' + pengantin.jenis_kelamin).text(pengantin.nama_panggilan)
            $('#pengantin_' + pengantin.jenis_kelamin).find('.nama_lengkap').text(pengantin
                .nama_lengkap)
            $('#pengantin_' + pengantin.jenis_kelamin).find('.foto').attr('src', pengantin.foto)
            $('#pengantin_' + pengantin.jenis_kelamin).find('.latar_belakang').text(pengantin
                .latar_belakang)

            if (pengantin.sosmeds.length) {
                let smd = ``
                $(pengantin.sosmeds).each(function (i, sosmed) {
                    smd += `
                    <li><a href="${sosmed.link}"><i class="ti-${sosmed.jenis}"></i></a></li>
                    `
                })
                $('#pengantin_' + pengantin.jenis_kelamin).find('.social ul').html(smd)
            }
        });
        //end nama pengantin

        //countdown
        acara.sort(function (a, b) {
            var tanggalA = new Date(a.tanggal);
            var tanggalB = new Date(b.tanggal);
            return tanggalA - tanggalB;
        });
        var acaraTerpilih = acara[0];

        if ($("#clock2").length) {
            $('#clock2').countdown(acaraTerpilih.tanggal, function (event) {
                var $this = $(this).html(event.strftime('' +
                    '<div class="box translate"><div><div class="time">%m</div> <span>Bulan</span> </div></div>' +
                    '<div class="box translate"><div><div class="time">%D</div> <span>Hari</span> </div></div>' +
                    '<div class="box translate"><div><div class="time">%H</div> <span>Jam</span> </div></div>' +
                    '<div class="box translate"><div><div class="time">%M</div> <span>Menit</span> </div></div>' +
                    '<div class="box translate"><div><div class="time">%S</div> <span>Detik</span> </div></div>'
                ));
            });
        }
    }

    function fetch_story(response) {
        let undangan = response.undangan
        let tab_story = $('#tab_story')
        let tab_html = ``
        let story_content = $('#story_content')
        let story_html = ``
        if (undangan.story.length) {
            $(undangan.story).each(function (index, story) {
                let active = index == 0 ? 'active' : ''
                let show = index == 0 ? 'show' : ''
                let selected = index == 0 ? true : false
                tab_html +=
                    `
                    <li class="nav-item" role="presentation">
                                <a class="nav-link ${active}" id="Story${index}-tab" data-bs-toggle="tab" href="#Story${index}" role="tab" aria-controls="Story${index}" aria-selected="${selected}">${story.judul}</a>
                            </li>
                    `
                story_html += `
                <div class="tab-pane fade translate ${active} ${show}" id="Story${index}">
                            <div class="wpo-story-item">
                                <div class="wpo-story-img d-none d-md-block">
                                    <img src="https://images.unsplash.com/photo-1514881097029-ef545203c842?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="">
                                </div>
                                <div class="wpo-story-content">
                                    <div class="wpo-story-content-inner">
                                        <span><img src="${base_url}/images/story/2.png" alt=""></span>
                                        <h2>${story.judul}</h2>
                                        <span>${story.dari_tahun} - ${story.sampai_tahun}</span>
                                        <p>${story.cerita}</p>
                                        <div class="border-shape">
                                            <img src="${base_url}/images/story/shape.jpg" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                `
            })
            tab_story.html(tab_html)
            story_content.html(story_html)
        }
    }

    function fetch_video(response) {
        let undangan = response.undangan
        let section = $('.wpo-video-section')
        section.css('background-image',
            `url('https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
        )

        function convertToEmbed(link) {
            // Ekspresi reguler untuk mengidentifikasi link YouTube
            var youtubeRegex =
                /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

            // Mencocokkan link dengan ekspresi reguler
            var match = link.match(youtubeRegex);

            // Jika link cocok dengan ekspresi reguler
            if (match) {
                var videoId = match[1];
                return 'https://www.youtube.com/embed/' + videoId;
            } else {
                // Jika link tidak cocok dengan ekspresi reguler, mengembalikan link asli
                return link;
            }
        }

        section.find('a').attr('href', convertToEmbed(undangan.video_prewedding))
    }

    function fetch_gallery(response) {
        let undangan = response.undangan
        if (undangan.gallery.length) {
            let container = $('.gallery-container')
            let content = ``
            $(undangan.gallery).each(function (index, gallery) {
                content += `
                <div class="grid">
                            <div class="img-holder">
                                <a href="${gallery.foto}" class="fancybox"
                                    data-fancybox-group="gall-1">
                                    <img src="${gallery.foto}" alt class="img img-responsive">
                                    <div class="hover-content">
                                        <i class="ti-plus"></i>
                                    </div>
                                </a>
                            </div>
                        </div>
                `
            })
            container.html(content)
            setTimeout(() => {
                if ($(".sortable-gallery .gallery-filters").length) {
                    var $container = $('.gallery-container');
                    $container.isotope({
                        filter: '*',
                        animationOptions: {
                            duration: 750,
                            easing: 'linear',
                            queue: false,
                        }
                    });

                    $(".gallery-filters li a").on("click", function () {
                        $('.gallery-filters li .current').removeClass('current');
                        $(this).addClass('current');
                        var selector = $(this).attr('data-filter');
                        $container.isotope({
                            filter: selector,
                            animationOptions: {
                                duration: 750,
                                easing: 'linear',
                                queue: false,
                            }
                        });
                        return false;
                    });
                }

                if ($(".fancybox").length) {
                    $(".fancybox").fancybox({
                        openEffect: "elastic",
                        closeEffect: "elastic",
                        wrapCSS: "project-fancybox-title-style"
                    });
                }
            }, 1000);

        } else {
            $('#gallery').addClass('d-none')
        }
    }

    function fetch_acara(response) {
        let undangan = response.undangan
        let base = $('#daftar_acara')
        let content = ``
        $(undangan.acara).each(function (index, acara) {
            content += `
            <div class="col col-lg-4 col-md-6 col-12 translate">
                    <div class="wpo-event-item">
                        <div class="wpo-event-text">
                            <h2>${acara.nama_acara}</h2>
                            <ul>
                                <li>${ubahFormatTanggal(acara.tanggal)}</li>`


            if (acara.alamat != 'null') {
                content += `<li>${acara.alamat}</li>`
            }
            if (acara.link_map != 'null') {
                content += `<li> <a class="popup-gmaps"
                                        href="${acara.link_map}">Lihat Lokasi</a></li>`
            }


            content += `</ul>
                        </div>
                    </div>
                </div>
            `
        })
        base.html(content)
    }

    function fetch_ucapan() {
        let response = JSON.parse(localStorage.getItem('response'))
        let undangan = response.undangan
        $.ajax({
            url: backand_url + `/udg/ucapan?undangan=${undangan.uniq_id}`,
            method: 'get',
            success: function (response) {
                let data = response.data
                let base_ucapan = $('#base_ucapan')
                let content = ``
                $(data.reverse()).each(function (index, ucapan) {
                    let date = moment(ucapan.created_at).format('DD/MM/YYYY HH:mm');
                    content += `
                    <li class="mb-3 translate">
                        <div class="card" style="border-radius:20px;">
                            <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div class="d-flex gap-2 align-items-center">
                                    <img class="rounded-circle" src="${base_url}/images/profile-placeholder.jpg"
                                        style="width: 20px; height: 20px; border: 1px solid rgb(126, 126, 126);">
                                    <span>${ucapan.nama_pengirim}</span>
                                </div>
                                <small>${date}</small>
                            </div>
                            <hr>
                                ${ucapan.pesan}
                            </div>
                        </div>
                    </li>
                    `
                })
                base_ucapan.html(content)
            },
            error: function (response) {
                alertify.error('Terjadi kesalahan');
            }
        })
    }

    function fetch_wallet(response) {
        let undangan = response.undangan
        let form = $('#form_amplop')
        let base_wallet = form.find('#wallet_id')
        let base_wallet_info = form.find('#base_wallet_info')
        let wallet_id = ``
        let wallet_info = ``

        $(undangan.wallet).each(function (index, wallet) {
            let active = index != 0 ? 'd-none' : ''
            wallet_id += `<option value="${wallet.id}">${wallet.nama_wallet}</option>`
            wallet_info += `
           <div class="p-3 mb-3 wallet_info translate ${active}" style="border: 2px dotted rgb(88, 88, 88); color: black;" id="wallet_info${wallet.id}"> 
           <div>Nomor : ${wallet.nomor_wallet}</div>
           <div>Atas Nama : ${wallet.atas_nama_wallet}</div>
           </div>
           `
        })
        base_wallet.html(wallet_id)
        base_wallet_info.html(wallet_info)
    }

    function fetch_section(response) {
        let page_setting = response.undangan.page_setting
        let page_title = response.undangan.judul
        let quote = response.undangan.quote

        let section_acara = page_setting.section.acara
        if (section_acara) {
            $('#section_acara_judul').text(section_acara.judul)
        }
        if (page_title) {
            $('.page_title').text(page_title)
        }
        if (page_setting.section.wallet) {
            $('.wallet_title').text(page_setting.section.wallet.judul)
        }
        if (quote) {
            $('.quote').text(quote)
        }

    }

    function fetchRsvp(response) {
        let rsvpData = response.undangan.rsvp_setting;
        let form = $('#form_rsvp');

        // Clear existing form elements
        form.empty();

        // Loop through rsvp setting data
        rsvpData.forEach(setting => {
            let inputElement;
            let additional_place = ''
            if (setting.data_name == 'custom' || setting.data_name == 'alasan') {
                additional_place = ' (opsional)'
            }
            switch (setting.element) {
                case 'select':
                    inputElement = $('<select>', {
                        name: setting.field_name,
                        id: setting.field_name,
                        class: 'form-control mb-3 shadow-none',
                        required: true
                    });

                    try {
                        let options = JSON.parse(JSON.parse(setting.options));

                        // Check if options is an array
                        if (!Array.isArray(options)) {
                            throw new Error('Parsed options is not an array');
                        }
                        inputElement.append($('<option>', {
                            value: '',
                            text: setting.label + additional_place,
                            selected: true,
                            disabled: true
                        }));
                        options.forEach(option => {
                            inputElement.append($('<option>', {
                                value: option.value,
                                text: option.label
                            }));
                        });
                    } catch (error) {
                        console.error('Error parsing or processing options:', error);
                    }
                    break;
                case 'textarea':
                    inputElement = $('<textarea>', {
                        name: setting.field_name,
                        id: setting.field_name,
                        class: 'form-control mb-3 shadow-none',
                        placeholder: setting.label + additional_place,
                        required: true
                    });
                    break;
                case 'input_text':
                    inputElement = $('<input>', {
                        type: 'text',
                        name: setting.field_name,
                        id: setting.field_name,
                        class: 'form-control mb-3 shadow-none',
                        placeholder: setting.label + additional_place,
                        required: true
                    });
                    break;
                default:
                    break;
            }

            // Append input element to form
            form.append($('<div>').addClass('translate').append(inputElement));
        });
    }




    function fetchCovidProtocol(response) {
        let undangan = response.undangan
        if (undangan.page_setting.fitur_covid == 'no') {
            $('#covid').addClass('d-none')
        }
    }

    function fetch_page_setting(response) {
        let lang = 'id'
        if (response.undangan.page_setting.bahasa == 'inggris') {
            lang = 'en'
        }
        localStorage.setItem('set_lang', lang)

        let page_setting = response.undangan.page_setting
        if (page_setting.urutan_pengantin == 'female_first') {
            $('#pengantin_laki_laki').addClass('order-3')
            $('#middle_couple_text').addClass('order-2')
        }

    }


    $.ajax({
        url: backand_url + `/undangan/${code}/${slug}`,
        method: 'get',
        success: function (response) {


            localStorage.setItem('response', JSON.stringify(response))
            fetch_page_setting(response)
            fetch_meta(response)
            fetch_hero(response)
            fetch_story(response)
            fetch_video(response)
            fetch_gallery(response)
            fetch_acara(response)
            fetch_ucapan()
            fetch_wallet(response)
            fetch_section(response)
            fetchRsvp(response)
            fetchCovidProtocol(response)
        },
        error: function (response) {
            alertify.error('Terjadi kesalahan');
        }
    })


    //ACTION
    function kirim_ucapan(data) {
        $.ajax({
            url: backand_url + '/udg/ucapan',
            data: data,
            method: 'post',
            success: function (response) {
                fetch_ucapan()
                alertify.success('Berhasil mengirim ucapan');
            },
            error: function (response) {
                if (response.status == 422) {
                    alertify.error('Formulir tidak lengkap');
                } else {
                    alertify.error('Gagal mengirim ucapan');
                }
            },
            complete: function () {
                $('#send_btn_ucapan').html('Kirim')
            }
        })
    }

    function kirim_kehadiran(data, btn, form) {
        $.ajax({
            url: backand_url + '/udg/kehadiran',
            data: data,
            method: 'post',
            beforeSend: function () {
                btn.html(`<span class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true">
                </span>`);
            },
            success: function (response) {
                alertify.success('Berhasil mengirim kehadiran');
                btn.html('Kirim')
                form.find('#jumlah_tamu').val('');
                form.find('#status_hadir').val('');
                form.find('#alasan').val('');
                form.find('#custom').val('');
            },
            error: function (response) {
                if (response.status == 422) {
                    alertify.error('Formulir tidak lengkap');
                } else {
                    alertify.error('Gagal mengirim ucapan');
                }
                btn.html('Kirim')
            },
            complete: function () {
                $('#send_btn_ucapan').html('Kirim')
                btn.html('Kirim')
            }
        })
    }


    $('#send_btn_ucapan').click(function () {
        let form = $('#form_ucapan')
        let response = JSON.parse(localStorage.getItem('response'))
        let undangan = response.undangan

        let nama_pengirim = ''
        $(undangan.bagikan_ke).each(function (index, bagikan) {
            if (bagikan.slug == slug) {
                nama_pengirim = bagikan.nama_pengirim
            }
        })

        let field_wakil_dari = form.find('#wakil_dari').val()
        let field_link_sosmed = form.find('#link_sosmed').val()
        let field_pesan = form.find('#pesan').val()

        if (field_pesan == '') {
            alertify.error('Isi pesan singkat');
            return false
        }

        let data_ucapan = {
            undangan_id: undangan.id,
            nama_pengirim: response.nama_penerima,
            wakil_dari: field_wakil_dari,
            link_sosmed: field_link_sosmed,
            pesan: field_pesan
        }

        $(this).html(`<span class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true">
                      </span>`)

        kirim_ucapan(data_ucapan)

        //clear form
        form.find('#wakil_dari').val('')
        form.find('#link_sosmed').val('')
        form.find('#pesan').val('')

    })



    //amplop
    var form_amplop = $('#form_amplop')
    let wallet = form_amplop.find('#wallet_id')
    wallet.change(function () {
        let self_val = $(this).val()
        form_amplop.find('.wallet_info').addClass('d-none')
        form_amplop.find('#wallet_info' + self_val).removeClass('d-none')
    })

    $('#send_amplop_btn').click(function () {
        let response = JSON.parse(localStorage.getItem('response'))
        let undangan = response.undangan

        let field_jumlah_transfer = form_amplop.find('#jumlah_transfer').val()
        let field_pesan_singkat = form_amplop.find('#pesan_singkat').val()
        let field_bukti_tf = form_amplop.find('#bukti_tf')[0].files[0]; // Ambil file bukti transfer

        if (field_jumlah_transfer == '' || field_bukti_tf == undefined) {
            alertify.error('Isi nominal dan unggah bukti transfer');
            return false
        }

        let data = new FormData(); // Buat objek FormData

        data.append('undangan_id', undangan.id);
        data.append('nama_pengirim', response.nama_penerima);
        data.append('wallet_id', wallet.val());
        data.append('jumlah_transfer', field_jumlah_transfer);
        data.append('pesan_singkat', field_pesan_singkat);
        data.append('bukti_tf', field_bukti_tf); // Tambahkan file bukti transfer

        $.ajax({
            url: backand_url + '/udg/amplop',
            data: data,
            method: 'post',
            processData: false, // Tidak memproses data secara otomatis
            contentType: false, // Tidak mengatur tipe konten secara otomatis
            beforeSend: function () {
                $('#send_amplop_btn').html(`<span class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true">
                      </span>`)
            },
            success: function (response) {
                form_amplop.find('#jumlah_transfer').val('')
                form_amplop.find('#pesan_singkat').val('')
                form_amplop.find('#bukti_tf').val('')
                $('#modal_amplop').modal('hide')
                alertify.success('Berhasil mengirim kehadiran');
            },
            error: function (response) {
                if (response.status == 422) {
                    alertify.error('Formulir tidak lengkap');
                } else {
                    alertify.error('Gagal mengirim ucapan');
                }
            },
            complete: function () {
                $('#send_amplop_btn').html('Kirim')
            }
        })
    })

    $('#send_btn_rsvp').click(function () {
        let form = $('#form_rsvp');
        let response = JSON.parse(localStorage.getItem('response'));
        let undangan = response.undangan;

        let nama_pengirim = '';
        $(undangan.bagikan_ke).each(function (index, bagikan) {
            if (bagikan.slug == slug) {
                nama_pengirim = bagikan.nama_pengirim;
            }
        });

        let data = {
            undangan_id: undangan.id,
            nama_pengirim: response.nama_penerima,
        };

        // Iterate over rsvp_setting to get form data
        $(undangan.rsvp_setting).each(function (index, setting) {
            let field_value;
            switch (setting.field_name) {
                case 'status_hadir':
                    field_value = form.find('#status_hadir').val();
                    break;
                case 'alasan':
                    field_value = form.find('#alasan').val();
                    break;
                case 'jumlah_tamu':
                    field_value = form.find('#jumlah_tamu').val();
                    break;
                case 'custom':
                    field_value = form.find('#custom').val();
                    break;
                default:
                    break;
            }

            // Validate if field is required
            if (field_value === '' && setting.field_name !== 'custom' && setting.field_name !== 'alasan') {
                alertify.error('Isi ' + setting.label);
                return false;
            }

            // Assign field value to data object
            data[setting.field_name] = field_value;
        });

        kirim_kehadiran(data, $(this), form);

    });


    //music
    let data_undangan = JSON.parse(localStorage.getItem('response')).undangan
    var audio = new Audio(data_undangan.music.file);

    audio.loop = true;

    let btn_music = $('#music')
    btn_music.attr('mode', 'pause')
    $('#music').click(function () {
        btn_music.find('.icon_music').addClass('d-none')
        if (btn_music.attr('mode') == 'pause') {
            audio.play();
            btn_music.attr('mode', 'play')
            btn_music.find('#icon_music_pause').removeClass('d-none')
        } else {
            audio.pause();
            btn_music.attr('mode', 'pause')
            btn_music.find('#icon_music_play').removeClass('d-none')
        }
    })

    $('#opening_modal').modal('show')

})