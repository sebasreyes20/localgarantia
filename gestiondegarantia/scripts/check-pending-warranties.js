const { prisma } = require("@/lib/db");
const { sendWarrantyReminder } = require("@/lib/email-service");

async function checkPendingWarranties() {
  try {
    // Obtener todas las garantías pendientes que tienen más de 24 horas de asignadas
    const pendingWarranties = await prisma.warranty.findMany({
      where: {
        warrantyStatus: "pending",
        assignedTo: {
          not: null
        },
        assignedAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 horas atrás
        },
        lastReminderSent: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // No enviar más de un recordatorio por día
        }
      },
      include: {
        assignedTo: true
      }
    });

    console.log(`Encontradas ${pendingWarranties.length} garantías pendientes que requieren recordatorio`);

    // Enviar recordatorios
    for (const warranty of pendingWarranties) {
      await sendWarrantyReminder(warranty, warranty.assignedTo);
      
      // Actualizar la fecha del último recordatorio
      await prisma.warranty.update({
        where: { id: warranty.id },
        data: { lastReminderSent: new Date() }
      });
    }

    console.log('✅ Proceso de recordatorios completado');
  } catch (error) {
    console.error('❌ Error al procesar recordatorios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
checkPendingWarranties(); 