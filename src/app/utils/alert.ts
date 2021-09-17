export enum AlertType {
  error = "error-alert",
  success = "success-alert",
}

export class Alert {
  static showAlert(
    snackBar: any,
    message: string,
    alertType: AlertType,
    actionName: string="",
    duration: number=3000,
    ondismiss?: () => void,
    action?: () => void,

  ) {
    let snackBarRef = snackBar.open(message, actionName, {
      duration: duration,
      verticalPosition: "top", // 'top' | 'bottom'
      horizontalPosition: "center", //'start' | 'center' | 'end' | 'left' | 'right'
      panelClass: [alertType],
    });
    snackBarRef.onAction().subscribe(() => {
      if (action) action();
    });
    snackBarRef.afterDismissed().subscribe(() => {
      if (ondismiss) ondismiss();
    });

    // snackBarRef.dismiss();
  }
}
