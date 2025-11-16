import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spotify-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spotify-player-component.html',
  styleUrls: ['./spotify-player-component.css'],
})
export class SpotifyPlayerComponent {
  showQR = false;

  playlistUrl = 'https://open.spotify.com/playlist/6kVwF8jp9ENdEdX2C8OobH';

  // Ruta actualizada del QR
  qrImage = 'assets/images/qr.png';

  toggleQR() {
    this.showQR = !this.showQR;
  }
}
