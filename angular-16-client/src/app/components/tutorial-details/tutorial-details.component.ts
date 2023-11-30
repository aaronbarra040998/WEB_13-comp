import { Component, Input, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css'],
})
export class TutorialDetailsComponent {
  @Input() viewMode = false;

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    published: false
  };

  message = '';

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getTutorial(this.route.snapshot.params['id']);
    }
  }

  getTutorial(id: string): void {
    this.tutorialService.get(id).subscribe({
      next: (data) => {
        this.currentTutorial = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  updatePublished(status: boolean): void {
    const data = {
      title: this.currentTutorial.title,
      description: this.currentTutorial.description,
      published: status
    };

    this.message = '';

    this.tutorialService.update(this.currentTutorial.id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.currentTutorial.published = status;
        this.message = res.message
          ? res.message
          : 'The status was updated successfully!';

        // Mostrar notificación
        this.showNotification(this.message, 'success');
      },
      error: (e) => {
        console.error(e);
        this.showNotification('Error al actualizar el tutorial', 'error');
      }
    });
  }

  updateTutorial(): void {
    this.message = '';

    this.tutorialService
      .update(this.currentTutorial.id, this.currentTutorial)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message
            ? res.message
            : 'This tutorial was updated successfully!';

          // Mostrar notificación
          this.showNotification(this.message, 'success');
        },
        error: (e) => {
          console.error(e);
          this.showNotification('Error al actualizar el tutorial', 'error');
        }
      });
  }

  deleteTutorial(): void {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este tutorial?');

    if (confirmDelete) {
      this.tutorialService.delete(this.currentTutorial.id).subscribe({
        next: (res) => {
          console.log(res);
          this.showNotification('Tutorial eliminado correctamente', 'success');
          this.router.navigate(['/tutorials']);
        },
        error: (e) => {
          console.error(e);
          this.showNotification('Error al eliminar el tutorial', 'error');
        }
      });
    }
  }

  private showNotification(message: string, type: string): void {
    alert(`${type.toUpperCase()}: ${message}`);
  }
}
