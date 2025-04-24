# Crear una nueva tarea programada
$Action = New-ScheduledTaskAction -Execute "node" -Argument "scripts/check-pending-warranties.js" -WorkingDirectory $PWD
$Trigger = New-ScheduledTaskTrigger -Daily -At 9AM
$Principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType S4U -RunLevel Highest
$Settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName "WarrantyReminders" -Action $Action -Trigger $Trigger -Principal $Principal -Settings $Settings -Description "Envía recordatorios diarios para garantías pendientes" 