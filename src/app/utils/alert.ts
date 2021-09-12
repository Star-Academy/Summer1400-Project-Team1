export enum AlertType{
    error="error-alert",
    success="success-alert"
}

export class Alert{
    
    static showAlert(snackBar:any,message:string,
        alertType:AlertType,
        actionName:string,
        duration:number,action: () => void){
        let snackBarRef = snackBar.open(message,actionName, {
            duration: duration,
            verticalPosition: 'top', // 'top' | 'bottom'
            horizontalPosition: 'center', //'start' | 'center' | 'end' | 'left' | 'right'
            panelClass: [alertType],
        });
        snackBarRef.onAction().subscribe(() => {
            action();
        });
        // snackBarRef.afterDismissed().subscribe(() => {
        //     console.log('The snack-bar was dismissed');
        // });
        //

        // snackBarRef.dismiss();
    }
}
